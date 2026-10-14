# ChistotaBack2
## Установка и настройка
1. Клонировать репозиторий:
```bash
git clone https://github.com/first-it-company/ChistotaBack2.git
```

2. Перейти в папку проекта:
```bash
cd chistota
```

3. Создать виртуальное окружение (Python 3.7+):
```bash
python -m venv venv
```

4. Активировать виртуальное окружение:
   - Windows:
   ```bash
   .\venv\Scripts\activate
   ```
   - macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

5. Установить зависимости:
```bash
pip install -r requirements.txt
```

6. Применить миграции:
```bash
python manage.py migrate
```

7. Создать админа
```bash
python manage.py createsuperuser
```
После создания супер-юзера можно зайти в админ-панель (/admin), где можно будет занести тестовые данные.

## Запуск проекта

```bash
python manage.py runserver
```

## Изменения 14.10.2026 — SECRET_KEY только из окружения (Weeek 31942)
- `chistota/settings.py` читает `SECRET_KEY` из переменной окружения, без значения по умолчанию в коде (старый ключ был в публичном репозитории).
- Переменная: `SECRET_KEY` в `.env` (сгенерировать: `openssl rand -base64 48`).
- Живой сайт Чистоты сейчас — репозиторий ChistotaDV на 92.63.177.25 (`/home/ChistotaDV`), там ключ тоже из `.env` и сменён 14.10.2026. Этот репозиторий на проде не развёрнут.
- Как проверить: без `SECRET_KEY` приложение не стартует; `grep -rn django-insecure chistota/` ничего не находит.
