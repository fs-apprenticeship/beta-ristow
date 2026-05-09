-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "learner_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_messages_lesson_id_learner_id_idx" ON "chat_messages"("lesson_id", "learner_id");

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
