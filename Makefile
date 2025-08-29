start:
	cp package.json ./.docker/js-app/package.json
	#docker-compose up --build
	docker compose up --build -d
	rm .docker/js-app/package.json
shell:
	docker exec -it quokka_app /bin/sh
watch:
	docker exec -it quokka_app npm run watch

### Prisma db
prisma-generate:
	docker exec -it quokka_app npx prisma generate
prisma-migrate:
	docker exec -it quokka_app npx prisma migrate dev --name init
