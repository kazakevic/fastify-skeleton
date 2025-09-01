start:
	docker compose up --build -d
start-prod:
	cat .env > .env.prod
	docker compose -f compose.prod.yaml up --build -d
shell:
	docker exec -it quokka_app /bin/sh
watch:
	docker exec -it quokka_app npm run dev

### Prisma db
prisma-generate:
	docker exec -it quokka_app npx prisma generate
prisma-migrate:
	docker exec -it quokka_app npx prisma migrate dev --name init
