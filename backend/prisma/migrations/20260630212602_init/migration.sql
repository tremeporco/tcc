-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reaction_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reagents" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "equation" TEXT NOT NULL,
    "is_balanced" BOOLEAN NOT NULL DEFAULT false,
    "temperature" DOUBLE PRECISION,
    "pressure" DOUBLE PRECISION,
    "reaction_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reaction_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "reaction_history" ADD CONSTRAINT "reaction_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
