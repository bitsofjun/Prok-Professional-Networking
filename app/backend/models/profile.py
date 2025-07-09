from extensions import db

class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    name = db.Column(db.String(120), default='')
    avatar = db.Column(db.String(255), default='')  # New: profile image path
    title = db.Column(db.String(120), default='')   # New: professional title
    location = db.Column(db.String(120), default='') # New: location
    social = db.Column(db.Text, default='')         # New: social links (JSON string)
    activity = db.Column(db.Text, default='')       # New: activity (JSON string)
    bio = db.Column(db.Text, default='')
    skills = db.Column(db.Text, default='')  # Comma-separated
    education = db.Column(db.Text, default='')  # JSON string
    experience = db.Column(db.Text, default='')  # JSON string
    contact = db.Column(db.Text, default='')  # JSON string
    user = db.relationship('User', backref=db.backref('profile', uselist=False))
    def __repr__(self):
        return f'<Profile user_id={self.user_id}>'
