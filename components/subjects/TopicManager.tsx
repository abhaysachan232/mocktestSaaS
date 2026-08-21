"use client";

import { useState } from "react";
import { createTopic, updateTopic, deleteTopic } from "@/actions/topic.actions";

type Topic = {
  id: string;
  name: string;

  _count: {
    questions: number;
    examTopics: number;
  };
};

type Props = {
  subjectId: string;
  topics: Topic[];
};

export default function TopicManager({ subjectId, topics }: Props) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const saveTopic = async () => {
    if (!name.trim()) {
      return;
    }

    setLoading(true);

    const result = editingId
      ? await updateTopic(editingId, {
          name,
        })
      : await createTopic({
          subjectId,
          name,
        });

    setLoading(false);

    if (!result.success) {
      alert(result.error);
      return;
    }

    setName("");
    setEditingId(null);

    window.location.reload();
  };

  const editTopic = (topic: Topic) => {
    setEditingId(topic.id);
    setName(topic.name);
  };

  const removeTopic = async (topic: Topic) => {
    const confirmed = window.confirm(`Delete "${topic.name}"?`);

    if (!confirmed) {
      return;
    }

    const result = await deleteTopic(topic.id);

    if (!result.success) {
      alert(result.error);
      return;
    }

    window.location.reload();
  };

  return (
    <div className="space-y-5">
      {/* Add / Edit */}

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter topic name"
          className="flex-1 rounded-md border px-3 py-2"
        />

        <button
          type="button"
          disabled={loading}
          onClick={saveTopic}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : editingId ? "Update" : "Add Topic"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
            className="rounded-md border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Topic List */}

      <div className="rounded-md border">
        {topics.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No topics available.
          </div>
        ) : (
          <div className="divide-y">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium">{topic.name}</p>
                  <p className="text-xs text-gray-500">
                    {topic._count.questions} questions
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editTopic(topic)}
                    className="rounded border px-3 py-1 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="rounded border border-red-500 px-3 py-1 text-sm text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
