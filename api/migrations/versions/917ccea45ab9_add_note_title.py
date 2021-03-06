"""Add note title

Revision ID: 917ccea45ab9
Revises: 839a2b222fe5
Create Date: 2021-08-30 18:09:08.776662

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '917ccea45ab9'
down_revision = '839a2b222fe5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('notes', sa.Column('title', sa.String(length=50), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('notes', 'title')
    # ### end Alembic commands ###
