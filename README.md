# Voici les commandes utiles

## Environnement Python
```bash
python3 -m venv env
python.exe -m pip install --upgrade pip #pour mettre à jour
source env/bin/activate #si vous êtes sur Linux
.\env\Scripts\Activate #si vous êtes sur Windows

#il faudra peut être éxécuter cette commande en tant qu'administrateur
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

pip install sqlalchemy
pip install fastapi
pip install pydantic
pip install uvicorn
pip install pyjwt
pip install passlib
pip install python-multipart
pip install pathlib
pip install bcrypt
```
## React
 ```bash
npm install
npm run dev

npm install [nom de la librairie]
 ```

## FastAPI
```bash
uvicorn main:app --reload
```
Et allez sur http://127.0.0.1:8000/docs