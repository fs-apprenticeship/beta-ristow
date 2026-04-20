-- CreateTable
CREATE TABLE "lesson_articles" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_articles_lesson_id_key" ON "lesson_articles"("lesson_id");

-- AddForeignKey
ALTER TABLE "lesson_articles" ADD CONSTRAINT "lesson_articles_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
