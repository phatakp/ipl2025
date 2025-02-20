run:
	uvicorn backend:app --reload

lint:
	pre-commit run --all

test:
	pytest ./tests/