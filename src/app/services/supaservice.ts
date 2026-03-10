import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Planta } from '../interfaces/planta';
import { environment } from '../../environments/environment';
import { Usuari } from '../interfaces/user';
import { Registre } from '../interfaces/registre';

/**
 * Mètode amb l'enjectable que afegeix (injecta) httpClient que és un singleton per tant tots utilitzen el mateix objecte en totes les cridades
 */
@Injectable({
  providedIn: 'root',
})
export class Supaservice {
  //private http = inject(HttpClient);
  private supabase: SupabaseClient;
  public userSession = signal<any>(null);
  public plantesSignal = signal<Planta[]>([]);
  public ultimsRegistres = signal<Registre[]>([]);
  public textRecerca = signal('');
  public plantesSignalFiltered = computed(() => {
    const plants = this.plantesSignal() || [];
    const text = this.textRecerca().toLowerCase();
    if (!text) return plants;
    return plants.filter((planta) => planta.nom.toLowerCase().includes(text));
  });

  constructor(private http: HttpClient) {
    this.supabase = createClient(environment.supabase_url, environment.supabase_key);
  }
  setRecerca(text: string) {
    this.textRecerca.set(text);
  }
  getUserSession() {
    return this.userSession;
  }
  getEco(data: string) {
    return data;
  }
  /**
   * @description Mètode per a demanar les plantes a la BD
   * SEMPRE que demanem HTTP CLIENT ens tornarà un observable, però en compte de dessubscrivir-se quan es completa l'acció.
   * @returns: array d'objecte. Si els volem convertir en un objecte propi deuriem de convertir-lo.
   * FailReturn: undefined.
   */
  getPlantes() {
    const result = this.http.get<Planta[]>(environment.supabase_url + '/rest/v1/plantes?select=*', {
      headers: new HttpHeaders({
        apikey: environment.supabase_key,
        Authorization: environment.supabase_bearer_anon,
      }),
    });
    return result;
  }
  setPlantes(data: any[]) {
  this.plantesSignal.set(data);
}
  /**
   * @description Mètode per a enviar l'objecte usuari logejat
   */
  async getUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }

  /**
   * @description Mètode per a enviar l'objecte usuari logejat
   */
  getUserDataObserver(): Observable<Usuari | null> {
    return from(this.supabase.auth.getUser()).pipe(
      map((resposta: any) => {
        if (!resposta.data.user) return null;

        let usuari: Usuari;
        usuari = {
          email: resposta.data.user.email,
          password: '',
          username: resposta.data.user.user_metadata.username,
          fullname: resposta.data.user.user_metadata.fullname,
          phone: resposta.data.user.phone,
        };
        return usuari;
      }),
    );
  }

  async logOut() {
    await this.supabase.auth.signOut();
    this.userSession.set(null);
    //TODO buidar les plantes
  }

  /**
   * @description Mètode 3: rebs un signal amb la interface de Planta i l'envies
   * @returns un SIGNAL d'array de Plantes
   * @tutorial SIGNAL de Resource s'utilitza amb un getValue() perquè és un objecte amb diversa informació, com percentatge de descàrrega, etc.
   * getSignalPlantes(): Signal<Plantes[]> {
   * return httpResource<Planta[]>(() => ({
   *   url: `${environment.supabaseUrl}/rest/v1/plantes?select=*`,
   *   headers: {
   *     apikey: environment.supabaseKey,
   *     Authorization: `Bearer ${environment.supabaseKey}`,
   *   },
   * }))
   * }
   */

  /**
   * @description Mètode ASYNC per a agafar les plantes mitjançant l'sdk.
   * @returns: Promise
   */
  async getFindAllSupabase(table: string) {
    const { data, error } = await this.supabase.from(table).select('*');
    if (error) throw new Error(`Backend Error fetching data: ${error.message}`);
    return data;
  }
  async getFindByIdSupabase(table: string, id: number) {
    const { data, error } = await this.supabase.from(table).select('*').eq('id', id);
    if (error) throw new Error(`Backend Error fetching data: ${error.message}`);
    return data;
  }
  async getFindByValueStringSupabase(table: string, field: string, value: string) {
    const { data, error } = await this.supabase.from(table).select('*').eq(field, value);
    if (error) throw new Error(`Backend Error fetching data: ${error.message}`);
    return data;
  }
  async countAllSupabase(table: string): Promise<number> {
    const { count, error } = await this.supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    if (error) throw new Error(`Backend Error fetching data: ${error.message}`);
    return count || 0;
  }
  async updateSupabase(table: string, planta: object) {
    const { data, error } = await this.supabase.from(table).upsert(planta).select();
    if (error)
      throw new Error(`Backend Error updating data: ${error.message} (Código: ${error.code})`);
    else return data;
  }
  async updateUser(dades: Usuari) {
    if (dades.email !== this.userSession().email)
      throw Error("No s'està actualitzant el propi usuari");
    const { email, password, ...metadata } = dades;
    console.log('entrat a update');

    const { data, error } = await this.supabase.auth.updateUser({
      email: email,
      password: password,
      data: this.cleanMetadata(metadata),
    });
    if (error) throw error;
    return dades;
  }
  async columnNames(table: string) {
    const { data, error } = await this.supabase.from(table).select('*').limit(1);

    if (error) {
      throw new Error(`Backend Error obteniendo columnas: ${error.message}`);
      return;
    } else return Object.keys(data[0]);
  }
  // MÈTODE COPIAT DE IA PERQUÈ TYPESCRIPT NO DEIXA FER metadata[element] DINS D'UN FOREACH PER A ELIMINAR ELS CAMPS BUITS, JA QUE SALTA EL ERROR DE POT SER ANY. COM NO SÉ CÓM FER EIXA ITERACIÓ I AL VORER LA SOLUCIÓ DE LA IA COMPROVE QUE MAI PODRIA HAVER-HO FET COPIE EL SEU MÈTODE.
  cleanMetadata<T extends object>(obj: T): Partial<T> {
    const result: Partial<T> = {};
    for (const key of Object.keys(obj) as Array<keyof T>) {
      const value = obj[key];
      if (value !== '' && value != null) {
        result[key] = value;
      }
    }
    return result;
  }

  async uploadPlantaImage(file: File, nom: string) {
    const extensio = file.name.split('.').pop() || 'jpg';
    const imgNom = `${this.userSession().email}_${Date.now()}.${extensio}`;

    const { error } = await this.supabase.storage
      .from('img-plantes')
      .upload(imgNom, file, { upsert: true });

    if (error) {
      throw error;
    }

    const { data } = this.supabase.storage.from('img-plantes').getPublicUrl(imgNom);

    return {
      path: imgNom,
      publicUrl: data.publicUrl,
    };
  }

  async createPlanta(dataPlanta: Planta, img: File | null) {
    const { created_at, id, ...dataPlantaClean } = dataPlanta;

    if (img) {
      const result = await this.uploadPlantaImage(img, dataPlanta.nom);
      dataPlantaClean.foto = result.publicUrl;
    }

    const { data, error } = await this.supabase
      .from('plantes')
      .insert(dataPlantaClean)
      .select()
      .single();
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }
    return data;
  }

  async deletePlanta(id: number) {
    const { error } = await this.supabase.from('plantes').delete().eq('id', id);
    if (error) throw error;
  }

  async deletePlantaConRegistros(id: number) {
    const { error: errorRegistres } = await this.supabase
      .from('registre')
      .delete()
      .eq('planta', id);
    if (errorRegistres) throw errorRegistres;
    const { error } = await this.supabase.from('plantes').delete().eq('id', id);
    if (error) throw error;
  }

  /**
   * Intenta esborrar la planta directament. Si té registres associats (FK 23503),
   * els elimina primer i després esborra la planta. Tota la lògica de cascada queda ací.
   */
  async deletePlantaSafe(id: number): Promise<void> {
    const { error } = await this.supabase.from('plantes').delete().eq('id', id);
    if (!error) return;
    if (error.code !== '23503') throw error;
    await this.deletePlantaConRegistros(id);
  }

  // --- Mètodes de login-service.ts ---

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.userSession.set(data.user);
    this.getFindByValueStringSupabase('plantes', 'usuari', this.userSession().id)
      .then((response) => this.setPlantes(response));
    return data.user;
  }

  // --- Mètodes de register-service.ts ---

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    this.userSession.set(data.user);
    return data.user;
  }

  // --- Mètodes de profile.ts ---

  async profileUser(userData: Usuari) {
    let authUser: any = null;
    let profilData: any = null;

    if (userData.password) {
      const { data, error } = await this.updateBasicsUser(userData.email, userData.password);
      if (error) throw error;
      authUser = data?.user;
    } else {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      authUser = data?.user;
    }

    if (!authUser?.id) throw new Error('No se pudo obtener el usuario autenticado');

    const camps: any = {};
    if (userData.username != null) camps.username = userData.username;
    if (userData.fullname != null) camps.fullname = userData.fullname;
    if (userData.phone != null) camps.phone = userData.phone;

    if (Object.keys(camps).length > 0) {
      profilData = await this.updateProfileUser(authUser.id, camps);
    }

    return profilData || authUser;
  }

  async updateBasicsUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.updateUser({ email, password });
    return { data, error };
  }

  async updateProfileUser(id: string, userData: object) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(userData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }

  async getRegistresByPlanta(plantaId: number) {
    const { data, error } = await this.supabase
      .from('registre')
      .select('*')
      .eq('planta', plantaId);
    if (error) {
      console.error('Error obteniendo registros por planta:', error);
      throw error;
    }
    return data;
  }

  async getUltimesRegistresByPlanta(plantaId: number, limit = 50): Promise<Registre[]> {
    const { data, error } = await this.supabase
      .from('registre')
      .select('*')
      .eq('planta', plantaId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as Registre[]).reverse();
  }

  async insertRegistresSupabase(registres: Registre[]) {
    const registresClean = registres.map(({ id, created_at, ...rest }) => rest);
    const { data, error } = await this.supabase.from('registre').insert(registresClean).select();
    if (error) {
      console.error('Error insertando registros:', error);
      throw error;
    }
    this.ultimsRegistres.set(data as Registre[]);
  }
}
