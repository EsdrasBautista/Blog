import datetime
from flask import Flask, request, jsonify, session
from models.article import Article
from models.user import User
from flask_cors import CORS
from models import db
app = Flask(__name__)
CORS(app, supports_credentials=True)


app.secret_key = "Esdras00$"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False




# inicializar la base de datos
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/')
def home():
    return "Hello, World!"

#-----------------------------------------------ENDPOINTS PARA ARTICULOS--------------------------------------------------#
#Ver todos los articulos 
@app.route('/articles', methods = ['GET'])
def get_articles():
    articles = Article.query.all()
    return jsonify([{'id': article.id, 'title': article.title, 'content': article.content, 'imagen_url': article.imagen_url, 'author': article.author.username, 'fecha_creacion': article.fecha_creacion} for article in articles])
    

#Crear articulo
@app.route('/create-article', methods=['POST'])
def create_article():
    data = request.get_json()
    fecha_actual = datetime.datetime.now()
    new_article = Article(title=data['title'], content=data['content'], imagen_url=data['imagen_url'], fecha_creacion=fecha_actual, user_id=session.get('user_id'), is_favorite=False)
    db.session.add(new_article)
    db.session.commit()
    return jsonify({
    'id': new_article.id,
    'title': new_article.title,
    'content': new_article.content,
    'imagen_url': new_article.imagen_url,
    'author': new_article.author.username,
    'fecha_creacion': new_article.fecha_creacion,
    'is_favorite': new_article.is_favorite
}), 201



#Actualizar articulo segun id
@app.route('/update-article/<int:article_id>', methods=['PUT'])
def update_article(article_id):
    data = request.get_json()
    article = Article.query.get_or_404(article_id)
    article.title = data['title']
    article.content = data['content']
    if data.get('imagen_url'): # verifica si la imagen_url existe
        article.imagen_url = data['imagen_url']

    db.session.commit()
    return jsonify({
        'id': article.id,
        'title': article.title,
        'content': article.content,
        'imagen_url': article.imagen_url,
        'author': article.author.username,
        'fecha_creacion': article.fecha_creacion,
        'is_favorite': article.is_favorite
    }), 201

#ver articulo segun id
@app.route('/article/<int:article_id>', methods=['GET'])
def view_article(article_id):
   article = Article.query.get_or_404(article_id)
   return jsonify({'id': article.id, 'title': article.title, 'content': article.content, 'imagen_url': article.imagen_url, 'author': article.author.username, 'fecha_creacion': article.fecha_creacion}),200


#Eliminar articulo segun id
@app.route('/delete-article/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    article = Article.query.get_or_404(article_id)
    db.session.delete(article)
    db.session.commit()
    return jsonify({'message': f'Articulo: {article.title} eliminado con exito!'}), 200


#-----------------------------------------------ENDPOINTS PARA USUARIOS--------------------------------------------------#
@app.route('/register', methods= ['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'El correo ya existe!'}), 400
    
    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': f'Usuario {new_user.username} creado con exito!'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify({'message': f'Bienvenido {user.username}!'}), 200
    else:
        return jsonify({'message': 'ERROR!, Credenciales inválidas!'}), 401


#verifica si el usuario esta autenticado
@app.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        idU = session['user_id']
        user = User.query.filter_by(id=idU).first()
        return jsonify({'autenticado': True, 'userName': user.username }), 200
    else:
        return jsonify({'autenticado': False}), 401
    

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Sesion cerrada con exito!'}), 200


#--------------------------------------------------------AGREGAR ARTICULO A FAVORITOS--------------------------------------------------#
@app.route('/add-favorite/<int:article_id>', methods=['POST'])
def add_favorite(article_id):
    data = request.get_json()
    is_favorite = data.get('is_favorite')
    article = Article.query.get_or_404(article_id)
    if article.is_favorite == is_favorite and is_favorite == True:
        return jsonify({'message': 'Articulo ya en favoritos!'}), 400
    
    if is_favorite:
        article.is_favorite = is_favorite
        db.session.commit()
        return jsonify({'message': 'Articulo agregado a favoritos!'}), 201
    else:
        print(is_favorite)
        article.is_favorite = is_favorite
        db.session.commit()
        return jsonify({'message': 'Articulo eliminado de favoritos!'}), 200
        

#------------------------------------------------------------------------------------------------------------------------//
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
