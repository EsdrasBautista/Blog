from models import db

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    imagen_url = db.Column(db.String(255), nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable= False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)    
    is_favorite = db.Column(db.Boolean, default = False, nullable=False)

    def __repr__(self):
        return f"Article('{self.title}', '{self.content}')"
