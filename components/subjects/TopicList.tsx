"use client";

import { useState } from "react";

import { createTopic, updateTopic, deleteTopic } from "@/actions/topic.actions";

type Topic = {
  id: string;
  name: string;
  _count: {
    // questions: number;
    examTopics: number;
  };
};

type Props = {
  subjectId: string;
  topics: Topic[];
};

export default function TopicList({ subjectId, topics }: Props) {
  const [topicName, setTopicName] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!topicName.trim()) {
      return;
    }
    setLoading(true);
    const result = await createTopic({
      subjectId,
      name: topicName,
    });
    setLoading(false);
    if (!result.success) {
      alert(result.error);
      return;
    }
    setTopicName("");
    window.location.reload();
  };

  const handleUpdate = async (id: string) => {
    if (!topicName.trim()) {
      return;
    }

    setLoading(true);

    const result = await updateTopic(id, {
      name: topicName,
    });

    setLoading(false);

    if (!result.success) {
      alert(result.error);
      return;
    }

    setTopicName("");
    setEditingId(null);

    window.location.reload();
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Delete "${name}"?`);

    if (!confirmed) {
      return;
    }

    const result = await deleteTopic(id);

    if (!result.success) {
      alert(result.error);
      return;
    }

    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {/* Add Topic */}

      <div className="flex gap-2">
        <input
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          placeholder="Enter topic name"
          className="flex-1 rounded-md border px-3 py-2"
        />

        <button
          type="button"
          disabled={loading}
          onClick={() => (editingId ? handleUpdate(editingId) : handleCreate())}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {editingId ? "Update" : "Add Topic"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTopicName("");
            }}
            className="rounded-md border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Topics */}

      <div className="rounded-md border">
        {topics.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No topics added yet.
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

                  {/* <p className="text-xs text-gray-500">
                    {topic._count.questions} Questions
                  </p> */}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(topic.id);
                      setTopicName(topic.name);
                    }}
                    className="rounded border px-3 py-1 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(topic.id, topic.name)}
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
