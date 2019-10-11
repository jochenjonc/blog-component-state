# Deprecations

<a id="deprecations-6.0.0-beta.4"></a>
## Deprecations introduced in version 6.0.0-beta.4 on 2018-03-29

<a id="deprecations-6.0.0-beta.4_never_method-to-constant"></a>
### Static method `never` deprecated in favour of constant `NEVER`

[Removed in version **8.x**]()

**Reason for deprecation**  
Deprecated because it is more efficient?

**Implications of deprecation**  
Replacing `never` with `NEVER`

**Refactoring Suggestions**  
Old usage:
```typescript
import { never } from 'rxjs';
never();
```

New usage:
```typescript
import { NEVER } from 'rxjs';
NEVER;
```

<a id="deprecations-6.0.0-beta.4_empty_method-to-constant"></a>
### Static method `empty` deprecated in favour of constant `EMPTY`

[Removed in version **8.x**]()

**Reason for deprecation**  
Deprecated because it is more efficient?

**Implications of deprecation**  
Replacing `empty` with `EMPTY`

**Refactoring Suggestions**  
Old usage:
```typescript
import { empty } from 'rxjs';
empty();
```

New usage:
```typescript
import { EMPTY } from 'rxjs';
EMPTY;
```

<a id="remove-6.0.0-beta.4"></a>
## Deprecations introduced in version 6.0.0-beta.4 on 2018-03-29
