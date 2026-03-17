-- CreateTable
CREATE TABLE "lesson_items" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "learner_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3),
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_items_learner_id_idx" ON "lesson_items"("learner_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_items_lesson_id_learner_id_position_key" ON "lesson_items"("lesson_id", "learner_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_items_lesson_id_learner_id_title_key" ON "lesson_items"("lesson_id", "learner_id", "title");

-- AddForeignKey
ALTER TABLE "lesson_items" ADD CONSTRAINT "lesson_items_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_items" ADD CONSTRAINT "lesson_items_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
