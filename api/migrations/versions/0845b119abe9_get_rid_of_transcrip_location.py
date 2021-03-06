"""get rid of transcrip location

Revision ID: 0845b119abe9
Revises: 1c1a064d7368
Create Date: 2021-08-22 18:29:05.318312

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0845b119abe9'
down_revision = '1c1a064d7368'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('notes', sa.Column('transcripted', sa.Boolean(), nullable=True))
    op.drop_column('notes', 'transcript_location')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('notes', sa.Column('transcript_location', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.drop_column('notes', 'transcripted')
    # ### end Alembic commands ###
