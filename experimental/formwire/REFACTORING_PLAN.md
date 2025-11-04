# FormEngine Refactoring Plan

## Проблема

FormEngine.js содержит слишком много ответственности (1022 строки):
- Управление значениями (values, initialValues)
- Управление ошибками (errors)
- Управление touched состоянием
- Управление active/focused состоянием
- Управление submitting состоянием
- Управление dirty/pristine состоянием
- Управление valid состоянием
- Батчинг операций
- Эмиссия событий
- Валидация
- Кеширование

## Решение: Feature-based Architecture

Разбить функциональность на отдельные feature модули, каждый из которых отвечает за свой аспект состояния формы.

## Архитектура

```
FormEngine (координатор)
├── ValuesFeature - управление значениями формы
├── ErrorsFeature - управление ошибками валидации
├── TouchedFeature - управление touched состоянием
├── ActiveFeature - управление active/focused состоянием
├── SubmittingFeature - управление submitting состоянием
├── DirtyFeature - управление dirty/pristine состоянием
└── Services (существующие)
    ├── ValidationService
    ├── CacheService
    ├── EventService
    └── BatchService
```

## Feature Modules

### 1. ValuesFeature
**Ответственность:** Управление значениями формы
- `get(path)` - получить значение по пути
- `set(path, value)` - установить значение
- `getAll()` - получить все значения
- `getInitial(path)` - получить начальное значение
- `init(initialValues)` - инициализация
- `reset()` - сброс к начальным значениям

### 2. ErrorsFeature
**Ответственность:** Управление ошибками валидации
- `get(path)` - получить ошибку по пути
- `set(path, error)` - установить ошибку
- `clear(path)` - очистить ошибку
- `getAll()` - получить все ошибки
- `isValid()` - проверить валидность формы
- `hasError(path)` - проверить наличие ошибки
- `init()` - инициализация
- `reset()` - сброс

### 3. TouchedFeature
**Ответственность:** Управление touched состоянием
- `isTouched(path)` - проверить touched
- `touch(path)` - пометить как touched
- `getTouchedArray()` - получить массив touched полей
- `init()` - инициализация
- `reset()` - сброс

### 4. ActiveFeature
**Ответственность:** Управление active/focused состоянием
- `getActive()` - получить активное поле
- `focus(path)` - установить фокус
- `blur()` - убрать фокус
- `isActive(path)` - проверить активность
- `init()` - инициализация
- `reset()` - сброс

### 5. SubmittingFeature
**Ответственность:** Управление submitting состоянием
- `isSubmitting()` - проверить submitting
- `setSubmitting(submitting)` - установить submitting
- `start()` - начать submitting
- `stop()` - остановить submitting
- `init()` - инициализация
- `reset()` - сброс

### 6. DirtyFeature
**Ответственность:** Управление dirty/pristine состоянием
- `isDirty()` - проверить dirty
- `isPristine()` - проверить pristine
- `isFieldDirty(path)` - проверить dirty поля
- `queueCheck(path)` - поставить в очередь проверку
- `init()` - инициализация
- `reset()` - сброс

## Преимущества

1. **Разделение ответственности** - каждый feature отвечает только за свой аспект
2. **Упрощение тестирования** - каждый feature можно тестировать отдельно
3. **Улучшение читаемости** - FormEngine становится координатором, а не монолитом
4. **Упрощение поддержки** - изменения в одном feature не влияют на другие
5. **Возможность расширения** - легко добавить новые features

## План миграции

1. ✅ Создать feature модули
2. ⏳ Обновить FormEngine для использования features
3. ⏳ Обновить все методы FormEngine для делегирования в features
4. ⏳ Обновить тесты
5. ⏳ Удалить старый код из FormEngine

## Пример использования

```javascript
// До рефакторинга
engine.get('fieldName');
engine.set('fieldName', 'value');
engine.isTouched('fieldName');
engine.touch('fieldName');
engine.isDirty();

// После рефакторинга (интерфейс остается тем же)
engine.get('fieldName'); // делегирует в valuesFeature
engine.set('fieldName', 'value'); // делегирует в valuesFeature
engine.isTouched('fieldName'); // делегирует в touchedFeature
engine.touch('fieldName'); // делегирует в touchedFeature
engine.isDirty(); // делегирует в dirtyFeature
```

## Заметки

- FormEngine остается публичным API без изменений
- Features получают ссылку на engine для доступа к services и другим features
- Features могут вызывать методы друг друга через engine (например, DirtyFeature использует ValuesFeature)
- Все события эмитятся через EventService

