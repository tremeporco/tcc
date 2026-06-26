-- CreateTable
CREATE TABLE "reaction_history" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
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

-- CreateTable
CREATE TABLE "substances" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "formula" TEXT NOT NULL,

    CONSTRAINT "substances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reaction_history" ADD CONSTRAINT "reaction_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
