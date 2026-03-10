**Errores de validación de Angular Forms (lo que usas en tu código):**

| Key Error | Validador Angular         | Cuándo se dispara           | Valor del error                                        |
| --------- | ------------------------- | ---------------------------- | ------------------------------------------------------ |
| required  | Validators.required       | Campo vacío                 | true                                                   |
| email     | Validators.email          | Formato email inválido      | true                                                   |
| minlength | Validators.minLength(n)   | Menos caracteres del mínimo | { requiredLength: 8, actualLength: 3 }                 |
| maxlength | Validators.maxLength(n)   | Más caracteres del máximo  | { requiredLength: 20, actualLength: 25 }               |
| pattern   | Validators.pattern(regex) | No coincide con el patrón   | { requiredPattern: '^[a-z]+$', actualValue: 'ABC123' } |
| min       | Validators.min(n)         | Número menor que el mínimo | { min: 18, actual: 15 }                                |
| max       | Validators.max(n)         | Número mayor que el máximo | { max: 100, actual: 150 }                              |

**Errores de Supabase Auth (runtime, cuando haces signUp/signIn):**

| Error Code                 | Descripción            | Cuándo ocurre                                  |
| -------------------------- | ----------------------- | ----------------------------------------------- |
| invalid_credentials        | Credenciales inválidas | Email/password incorrectos en login             |
| user_already_exists        | Usuario ya existe       | Email ya registrado                             |
| email_not_confirmed        | Email no confirmado     | Intento de login sin verificar email            |
| weak_password              | Contraseña débil      | Password no cumple requisitos de Supabase       |
| invalid_email              | Email inválido         | Formato email incorrecto (validación servidor) |
| over_email_send_rate_limit | Límite de emails       | Demasiados emails enviados                      |
| user_not_found             | Usuario no encontrado   | Email no existe en BD                           |

### Comunicación con el template

#### Caso de los formularios

Correcto, no es necesario usar signals para actualizar los errores o el estado de los formularios reactivos en Angular. El sistema de detección de cambios de Angular ya se encarga de actualizar el template automáticamente cuando cambian los valores, el estado o los errores de los controles del formulario.

Esto funciona porque Angular detecta los cambios en el estado del formulario y actualiza automáticamente el template cuando cambian las propiedades del control, como errors.

    * Los formularios reactivos (FormGroup, FormControl) ya son reactivos por diseño.
    * Los bindings en el template ({{ loginForm.get('email')?.errors | json }}) se actualizan solos cuando cambian los errores, valores o estados.
    * Solo necesitas signals si quieres gestionar estados personalizados fuera del sistema de formularios de Angular, o para lógica reactiva avanzada.

Cuando escribes en el input, Angular ejecuta la validación y actualiza el objeto errors del control. El binding en el template ({{ loginForm.controls['email'].errors | json }}) se vuelve a renderizar cada vez que cambia el valor de errors, gracias al sistema de detección de cambios de Angular.

Resumen:
El template se actualiza en tiempo real porque Angular observa los cambios en los controles del formulario y vuelve a renderizar el valor de errors automáticamente. No necesitas un observable ni un signal para esto, el binding de Angular lo gestiona por ti.

pristine:
Indica si el control ha sido modificado por el usuario.

    true: El usuario no ha cambiado el valor del control desde que se creó o se reseteó.
    false: El usuario ha cambiado el valor al menos una vez.

touched:
Indica si el control ha perdido el foco después de haberlo recibido.

true: El usuario ha entrado y salido (blur) del campo.
false: El usuario nunca ha salido del campo (no ha hecho blur).

Resumen:

    pristine → ¿El valor ha cambiado?
    touched → ¿El usuario ha salido del campo?

CAMBIAR ELS INTERFACES O MODELS

type PlantaFormModel = Omit<Planta, 'foto'> & {foto: string}

#### Ejemplo de respuesta de this.supabase.auth.getUser():

{
  "data": {
    "user": {
      "id": "a1b2c3d4-....-e5f6g7h8",
      "app_metadata": {
        "provider": "email",
        "providers": ["email"]
      },
      "user_metadata": {
        "fullname": "Juan Pérez",
        "username": "juanp"
      },
      "aud": "authenticated",
      "role": "authenticated",
      "email": "juan.perez@example.com",
      "phone": null,
      "confirmed_at": "2024-01-10T12:34:56.789Z",
      "last_sign_in_at": "2024-02-09T08:15:00.000Z",
      "created_at": "2023-11-20T09:00:00.000Z",
      "updated_at": "2024-02-01T10:00:00.000Z",
      "identities": [
        {
          "id": "ident-uuid",
          "user_id": "a1b2c3d4-....-e5f6g7h8",
          "identity_data": { "email": "juan.perez@example.com" },
          "provider": "email",
          "created_at": "2023-11-20T09:00:00.000Z"
        }
      ]
    }
  },
  "error": null
}

```{
  "data": {
    "user": {
      "id": "a1b2c3d4-....-e5f6g7h8",
      "app_metadata": {
        "provider": "email",
        "providers": ["email"]
      },
      "user_metadata": {
        "fullname": "Juan Pérez",
        "username": "juanp"
      },
      "aud": "authenticated",
      "role": "authenticated",
      "email": "juan.perez@example.com",
      "phone": null,
      "confirmed_at": "2024-01-10T12:34:56.789Z",
      "last_sign_in_at": "2024-02-09T08:15:00.000Z",
      "created_at": "2023-11-20T09:00:00.000Z",
      "updated_at": "2024-02-01T10:00:00.000Z",
      "identities": [
        {
          "id": "ident-uuid",
          "user_id": "a1b2c3d4-....-e5f6g7h8",
          "identity_data": { "email": "juan.perez@example.com" },
          "provider": "email",
          "created_at": "2023-11-20T09:00:00.000Z"
        }
      ]
    }
  },
  "error": null
}
```

# Guía Completa: Signal Forms en Angular 21+

## 🎯 ¿Qué son Signal Forms?

Signal Forms es una nueva API **experimental** de Angular 21+ que permite crear formularios reactivos basados completamente en **Signals**. Es una alternativa moderna a Reactive Forms y Template-Driven Forms.

⚠️ **IMPORTANTE**: Signal Forms es experimental. La API puede cambiar antes de estabilizarse.

---

## 📚 Conceptos Clave

### 1. Form Model (Modelo del Formulario)

El **form model** es un `signal()` que contiene los datos del formulario. Es la única fuente de verdad:

```typescript
// Definir la interfaz
interface RegistroFormData {
  nombre: string;
  email: string;
  edad: number;
}

// Crear el modelo como signal
registroModel = signal<RegistroFormData>({
  nombre: '',
  email: '',
  edad: 18
});
```

**Ventaja**: El modelo y el formulario se sincronizan automáticamente en ambas direcciones.

---

### 2. Form Function - form()

La función `form()` crea un **Field Tree** (árbol de campos) a partir del modelo:

```typescript
import { form } from '@angular/forms/signals';

registroForm = form(this.registroModel, {
  // Schema de validación
});
```

El Field Tree es una estructura que refleja la forma de tus datos y permite acceder a cada campo con notación de punto:

```typescript
registroForm.nombre    // Campo nombre
registroForm.email     // Campo email
registroForm.edad      // Campo edad
```

---

### 3. Schema de Validación

El segundo parámetro de `form()` es el **schema**, donde defines las reglas de validación:

```typescript
registroForm = form(this.registroModel, {
  nombre: (schemaPath) => [
    required({ message: 'El nombre es obligatorio' }),
    minLength(3, { message: 'Mínimo 3 caracteres' })
  ],
  
  email: (schemaPath) => [
    required({ message: 'El email es obligatorio' }),
    email({ message: 'Email inválido' })
  ]
});
```

**Validadores disponibles**:

- `required()` - Campo obligatorio
- `minLength(n)` - Longitud mínima
- `maxLength(n)` - Longitud máxima
- `min(n)` - Valor numérico mínimo
- `max(n)` - Valor numérico máximo
- `email()` - Validar formato de email
- `pattern(regex)` - Expresión regular personalizada

---

### 4. Validadores Personalizados

Puedes crear validadores personalizados usando una función:

```typescript
confirmarPassword: (schemaPath) => [
  required({ message: 'Confirma tu contraseña' }),
  
  // Validador personalizado
  ({ valueOf }) => {
    const password = valueOf(schemaPath.password);
    const confirmar = valueOf(schemaPath.confirmarPassword);
  
    if (password !== confirmar) {
      return {
        code: 'passwordMismatch',
        message: 'Las contraseñas no coinciden'
      };
    }
    return null; // null = válido
  }
]
```

**Parámetros del validador**:

- `valueOf(field)` - Obtiene el valor de otro campo
- `value()` - Signal con el valor actual del campo

---

### 5. Field State (Estado del Campo)

Cada campo tiene signals que representan su estado:

```typescript
// Acceder al estado del campo llamándolo como función
registroForm.nombre()  // Retorna un FieldState

// Signals disponibles:
registroForm.nombre().value()      // Valor actual
registroForm.nombre().valid()      // ¿Es válido?
registroForm.nombre().invalid()    // ¿Es inválido?
registroForm.nombre().touched()    // ¿Fue tocado?
registroForm.nombre().dirty()      // ¿Fue modificado?
registroForm.nombre().errors()     // Array de errores
```

**Nota importante**:

- `registroForm.nombre` → Referencia al campo (para [formField])
- `registroForm.nombre()` → FieldState con los signals

---

### 6. FormField Directive

En el template, usa `[formField]` para vincular inputs:

```typescript
<input 
  type="text" 
  [formField]="registroForm.nombre"
/>
```

**Sin comillas en el valor** porque pasas la referencia directa al campo, no una string.

---

## 🔄 Flujo de Datos

```
┌─────────────────┐
│  registroModel  │ ← Signal con los datos
│    (signal)     │
└────────┬────────┘
         │ form()
         ↓
┌─────────────────┐
│  registroForm   │ ← Field Tree
│  (form object)  │
└────────┬────────┘
         │ [formField]
         ↓
┌─────────────────┐
│   <input>       │ ← Input en el template
└─────────────────┘
```

Cuando el usuario escribe → El Field State se actualiza → El modelo se sincroniza automáticamente

---

## 💡 Acceso a Valores

### Desde el Template:

```html
<!-- Valor actual del campo -->
<p>Email: {{ registroForm.email().value() }}</p>

<!-- Desde el modelo -->
<p>Email: {{ registroModel().email }}</p>

<!-- Ambos están sincronizados -->
```

### Desde el Componente:

```typescript
// Leer valor
const email = this.registroForm.email().value();
const emailDesdeModelo = this.registroModel().email;

// Actualizar valor
this.registroForm.email().value.set('nuevo@email.com');

// O actualizar el modelo completo
this.registroModel.set({
  nombre: 'Juan',
  email: 'juan@example.com',
  edad: 25
});
```

---

## ✅ Validación en el Template

Usa la nueva sintaxis de control flow de Angular:

```html
@if (registroForm.email().touched() && registroForm.email().invalid()) {
  <div class="error-messages">
    @for (error of registroForm.email().errors(); track error.code) {
      <span class="error-message">{{ error.message }}</span>
    }
  </div>
}
```

**Estructura de un error**:

```typescript
{
  code: 'required',        // Código del error
  message: 'El email es obligatorio'  // Mensaje
}
```

---

## 🚀 Envío del Formulario

```typescript
onSubmit(event: Event) {
  event.preventDefault();
  
  // 1. Marcar todos los campos como tocados
  this.markAllAsTouched();
  
  // 2. Verificar si es válido
  if (this.registroForm().valid()) {
    // 3. Obtener datos del modelo
    const datos = this.registroModel();
  
    // 4. Enviar al servidor
    this.authService.register(datos).subscribe(...);
  }
}
```

---

## 📊 Comparación con Reactive Forms

| Característica            | Reactive Forms             | Signal Forms            |
| -------------------------- | -------------------------- | ----------------------- |
| **API base**         | RxJS Observables           | Signals                 |
| **Definición**      | FormGroup/FormControl      | form() + signal()       |
| **Binding**          | [formControl]              | [formField]             |
| **Acceso a valores** | .get('field')?.value       | .field().value()        |
| **Tipado**           | FormControl<string\| null> | Tipo directo del modelo |
| **Sincronización**  | Manual con patchValue      | Automática             |
| **Validación**      | Validators array           | Schema con funciones    |

---

## 🎓 Diferencias Clave para Estudiantes

### ❌ NO hagas esto (Reactive Forms):

```typescript
formControl="nombre"  // String
this.form.get('nombre')  // Acceso por string
```

### ✅ Haz esto (Signal Forms):

```typescript
[formField]="registroForm.nombre"  // Referencia directa
this.registroForm.nombre()  // Acceso con notación de punto
```

---

## 🔧 Instalación y Setup

1. **Angular 21+** es requerido
2. Importar desde `@angular/forms/signals`:

```typescript
import { form, FormField, required, email } from '@angular/forms/signals';

@Component({
  // ...
  imports: [FormField, CommonModule]
})
```

3. No necesitas importar `ReactiveFormsModule` para Signal Forms

---

## 🎯 Ejercicios de Práctica

1. **Básico**: Agrega un campo "teléfono" con validación de longitud
2. **Intermedio**: Crea un validador que verifique que el email no termine en ".test"
3. **Avanzado**: Implementa validación asíncrona (simular consulta al servidor)
4. **Experto**: Crea un formulario anidado (dirección con calle, ciudad, código postal)

---

## 📖 Recursos Adicionales

- [Documentación oficial](https://angular.dev/guide/forms/signals/overview)
- [Tutorial interactivo](https://angular.dev/tutorials/signal-forms)
- [Guía de migración](https://angular.dev/guide/forms/signals/migration)

---

## ⚠️ Consideraciones Importantes

1. **Experimental**: No usar en producción sin entender los riesgos
2. **Breaking changes**: La API puede cambiar en futuras versiones
3. **Compatibilidad**: Funciona solo con Angular 21+
4. **Performance**: Más eficiente que Reactive Forms gracias a signals

---

## 💬 Preguntas Frecuentes

**P: ¿Puedo usar Signal Forms con Reactive Forms en el mismo proyecto?**
R: Sí, pero se recomienda elegir uno para mantener consistencia.

**P: ¿Debo migrar todos mis formularios a Signal Forms?**
R: No si tu app funciona bien. Signal Forms son para nuevos proyectos o cuando refactorices.

**P: ¿Por qué `registroForm()` con paréntesis?**
R: Porque retorna el FieldState (objeto con signals). Sin paréntesis es la referencia al campo.

**P: ¿Cómo reseteo el formulario?**
R: Actualiza el modelo: `this.registroModel.set(valoresIniciales)`

---

¡Espero que esta guía te ayude a entender Signal Forms! 🚀

# Explicación de computed() y solución del error

¿Qué hace computed()?
computed() crea una señal derivada de solo lectura que:

Se recalcula automáticamente cada vez que sus dependencias cambian
Devuelve un Signal (de lectura, no modificable)
Es la forma moderna de Angular para valores que dependen de otros signals#
``// ✅ Se recalcula automáticamente cuando userData() cambia myValue = computed(() => {   return this.userData()?.name ?? 'Sin nombre'; });``

### Errores con COmputed

El problema es que form() necesita un WritableSignal (que se pueda modificar con .set() y .update()), pero tu computed() devuelve un Signal de solo lectura.

``// ❌ computed() devuelve Signal (solo lectura)
formModel = computed(() => ({...}));

// form() espera WritableSignal (modificable)
profileForm = computed(() =>
  form(this.formModel(), (schema) => {...})  // ← ERROR aquí
);``

Solución correcta: Usar effect()
En lugar de computed(), usa effect() para mantener formModel sincronizado:

¿Por qué effect() en lugar de computed()?

| Necesidad                                         | computed()              | effect()                    |
| ------------------------------------------------- | ----------------------- | --------------------------- |
| "Solo lectura reactiva"                           | ✅ Perfecto             | ❌ No, es para efectos      |
| "Modificar un signal basado en otros"             | ❌ No puedo             | ✅ Exacto para esto         |
| "Requiere WritableSignal"                         | ❌ Devuelve Signal      | ✅ Puede actualizar signals |
| "Ejecuta código cuando las dependencias cambian" | ❌ Solo calcula valores | ✅ Perfecto                 |

Aquí tienes una **traducción ampliada y explicativa** de la página oficial de **Utility Types de TypeScript**, junto con ejemplos prácticos, mejores prácticas y los errores habituales que se cometen al usarlos.

---

# 📦 Tipos de utilidad en TypeScript — traducido y ampliado

TypeScript incluye una serie de **utility types (tipos de utilidad)** que te permiten transformar tipos existentes sin tener que escribir nuevas interfaces desde cero. Están disponibles de forma global y son genéricos — es decir, funcionan sobre otros tipos para producir nuevos. ([typescriptlang.org][1])

---

---

## ✨ Tipos más comunes y para qué sirven

### 🔄 `Awaited<Type>`

Modela el comportamiento de `await`: toma un `Promise` (o promesa anidada) y **extrae su tipo resuelto**.

```ts
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
```

Útil cuando trabajas con APIs `async` y quieres conocer el tipo dentro de la promesa sin necesidad de “await” en tiempo de ejecución. ([typescriptlang.org][1])

---

### ❓ `Partial<Type>`

Convierte **todas las propiedades de un tipo en opcionales**.

```ts
interface User { id: number; name: string; }
type UpdateUser = Partial<User>;
```

Esto es ideal para funciones de actualización donde **no necesitas todos los campos** (por ejemplo, al actualizar parcialmente un objeto). ([GeeksforGeeks][2])

---

### ✔️ `Required<Type>`

El opuesto de `Partial`: todas las propiedades del tipo se vuelven **obligatorias**.

```ts
interface Props { a?: number; b?: string; }
type FullProps = Required<Props>; // a y b son obligatorios
```

---

### 🔒 `Readonly<Type>`

Hace que todas las propiedades sean **solo lectura** (no se pueden reasignar).

```ts
type RUser = Readonly<User>;
```

Perfecto para datos que no deberían cambiar una vez inicializados (ej. configuración). ([typescriptlang.org][1])

---

### 🗂️ `Record<Keys, Type>`

Crea un tipo de objeto cuyas claves son las de `Keys` y valores de `Type`.

```ts
type Roles = "admin" | "user";
type Permissions = Record<Roles, boolean>;
```

Muy útil para mapas de configuración o catálogos donde las claves están en una unión literal. ([typescriptlang.org][1])

---

### 📋 `Pick<Type, Keys>` y ✂️ `Omit<Type, Keys>`

* **Pick:** selecciona un subconjunto de propiedades.
* **Omit:** excluye ciertas propiedades.

```ts
type UserName = Pick<User, "name">;
type UserWithoutId = Omit<User, "id">;
```

Son excelentes para **crear vistas específicas** de un tipo base sin duplicar definiciones. ([typescriptlang.org][1])

---

### 🚫 `Exclude<UnionType, ExcludedMembers>`

De un tipo unión, elimina los miembros especificados:

```ts
type T = Exclude<"a"|"b"|"c", "a">;  // "b"|"c"
```

Ideal para **filtrar tipos** antes de usarlos, especialmente en lógica de funciones genéricas. ([typescriptlang.org][1])

---

### 🔍 `Extract<Type, Union>`

Lo contrario de `Exclude`: se queda solo con los miembros que **sí concuerdan** con otro tipo.

```ts
type OnlyLetters = Extract<string|number, string>;
```

---

### ❌ `NonNullable<Type>`

Elimina `null` y `undefined` de un tipo:

```ts
type T = NonNullable<string|null|undefined>; // string
```

Importante: para que haga efecto real, generalmente necesitas tener **strictNullChecks activado** en el `tsconfig.json`. ([typescriptlang.org][1])

---

### 📐 `ReturnType<Type>` y `Parameters<Type>`

* **ReturnType:** obtiene el tipo que retorna una función.
* **Parameters:** obtiene los tipos de los parámetros como una **tupla**.

```ts
type FnReturn = ReturnType<() => number>;  // number
type FnParams = Parameters<(x: string) => void>; // [string]
```

Perfectos para crear envoltorios o transformaciones de funciones que mantienen la coincidencia de tipos. ([DEV Community][3])

---

## 🧠 Mejores prácticas (qué hacer)

✅ Usa utility types para **derivar tipos en lugar de reescribirlos manualmente**, lo que reduce duplicación y errores. ([GeeksforGeeks][2])

✅ Mantén las transformaciones simples y comprensibles — **no anides múltiples utility types sin necesidad** (puede complicar la lectura). ([DEV Community][3])

✅ Combínalos con alias de tipo (`type`) y comentarios para explicar transformaciones complejas.

---

## ❗ Errores habituales y malentendidos

### ❌ Confundir `Omit` y `Exclude`

Un error bastante frecuente: intentar usar `Omit` para filtrar miembros de un tipo unión, lo cual **no funciona** porque `Omit` está pensado para *propiedades de objetos*, no para tipos de unión. ([Reddit][4])

👉 En ese caso deberías usar `Exclude`:

```ts
type Action = "Buy"|"Sell"|"Both";
type OnlyTrade = Exclude<Action, "Both">; // correcto
```

Usar `Omit<Action, "Both">` no hace nada útil porque TypeScript no está omitiendo miembros de un tipo unión. ([Reddit][4])

---

### ❌ Uso de utility types sin control de null

Si tienes:

```ts
type Foo = string | null | undefined;
type Bar = NonNullable<Foo>;
```

Funciona **solo si** `strictNullChecks` está activado. Si no, TypeScript permite `null` incluso con `NonNullable`. ([Reddit][5])

---

### ⚠️ Olvidar que algunos tipos no validan claves estrictamente

Utility types como `Omit`, `Exclude` y `Extract` **no lanzan error si la clave que pasas no existe en el tipo original** (a diferencia de `Pick`, que requiere `K extends keyof T`). Esto puede permitir errores silenciosos por **fallos de refactorización o typos** en nombres de propiedades. ([Mercury][6])

---

### ⚠️ Tipos complejos y legibilidad

Combinaciones excesivas como:

```ts
type Complex = Partial<Required<Pick<User, "name"|"email">>>;
```

pueden **volver confuso el propósito real del tipo** sin beneficio claro. Usa alias para aclarar intención o reduce la jerarquía. ([DEV Community][3])

---

## 📌 Resumen

Los utility types de TypeScript son herramientas muy poderosas para modelar tipos derivados, mantener el código DRY (no repetir lógica) y facilitar refactorizaciones seguras. Se utilizan muchísimo en código real — especialmente en librerías, APIs y frameworks como React. ([GeeksforGeeks][2])

Si quieres, puedo darte **ejemplos con código práctica para cada uno** de estos tipos y cómo combinarlos paso a paso. ¿Quieres una colección de ejemplos listos para usar?

[1]: https://www.typescriptlang.org/docs/handbook/utility-types?utm_source=chatgpt.com
[2]: https://www.geeksforgeeks.org/typescript/typescript-utility-types/?utm_source=chatgpt.com
[3]: https://dev.to/syncfusion/typescript-utility-types-a-complete-guide-4mci?utm_source=chatgpt.com
[4]: https://www.reddit.com/r/typescript/comments/1hqopry?utm_source=chatgpt.com
[5]: https://www.reddit.com/r/typescript/comments/nc4z9o?utm_source=chatgpt.com
[6]: https://mercury.com/blog/utility-types-in-typescript?utm_source=chatgpt.com
