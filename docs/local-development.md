# Local development

## Requirements

- Docker Desktop running.
- Git.
- A code editor.

## Start the application

From the project root:

```bash
./vendor/bin/sail up -d
```

Start the frontend development server:

```bash
./vendor/bin/sail npm run dev
```

Open http://127.0.0.1:8000.

## Check the frontend

```bash
./vendor/bin/sail npx tsc --noEmit
```

```bash
./vendor/bin/sail npm run build
```

## Stop the application

Stop the frontend process with Control + C, then:

```bash
./vendor/bin/sail down
```

Do not add `-v` unless you intend to remove the database volumes.