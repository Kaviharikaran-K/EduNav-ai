"""Create core schema for EduNav AI."""

from alembic import op
import sqlalchemy as sa

revision = "001_create_core_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "institutions",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("institution_type", sa.String(length=100), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_table(
        "departments",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("institution_id", sa.Integer(), sa.ForeignKey("institutions.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
    )
    op.create_table(
        "subjects",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("code", sa.String(length=50), nullable=True),
    )
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False),
        sa.Column("institution_id", sa.Integer(), sa.ForeignKey("institutions.id"), nullable=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id"), nullable=True),
        sa.Column("academic_year", sa.String(length=50), nullable=True),
        sa.Column("semester", sa.String(length=50), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_table(
        "academic_profiles",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("study_hours_goal", sa.Float(), nullable=True),
        sa.Column("current_topic", sa.String(length=255), nullable=True),
        sa.Column("academic_goals", sa.Text(), nullable=True),
        sa.Column("weak_topics", sa.Text(), nullable=True),
    )
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("subject", sa.String(length=255), nullable=True),
        sa.Column("priority", sa.String(length=30), nullable=True),
        sa.Column("deadline", sa.DateTime(), nullable=True),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("read", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("notifications")
    op.drop_table("tasks")
    op.drop_table("academic_profiles")
    op.drop_table("users")
    op.drop_table("subjects")
    op.drop_table("departments")
    op.drop_table("institutions")
