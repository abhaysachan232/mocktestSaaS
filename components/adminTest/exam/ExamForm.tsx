"use client";

import { useForm, useFieldArray } from "react-hook-form";
import SubjectField from "./SubjectField";
import { ExamFormValues } from "./types";

export default function ExamForm() {
  const {
    register,
    control,
    handleSubmit,
  } = useForm<ExamFormValues>({
    defaultValues: {
      name: "",
      code: "",
      subjects: [],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "subjects",
  });

  const onSubmit = (data: ExamFormValues) => {
    console.log(data);

    /*
      POST API

      {
        name,
        code,
        subjects:[]
      }

    */
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Exam Details
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="font-medium">
              Exam Name
            </label>

            <input
              {...register("name")}
              className="mt-2 w-full border rounded-xl p-3"
              placeholder="SSC CGL"
            />

          </div>

          <div>

            <label className="font-medium">
              Exam Code
            </label>

            <input
              {...register("code")}
              className="mt-2 w-full border rounded-xl p-3"
              placeholder="SSC_CGL"
            />

          </div>

        </div>

      </div>

      <div className="space-y-6">

        {fields.map((field, index) => (

          <SubjectField
            key={field.id}
            index={index}
            control={control}
            register={register}
            remove={remove}
          />

        ))}

      </div>

      <button
        type="button"
        onClick={() =>
          append({
            name: "",
            code: "",
            topics: [],
          })
        }
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        + Add Subject
      </button>

      <div>

        <button
          className="bg-green-600 text-white px-8 py-4 rounded-xl"
        >
          Save Exam
        </button>

      </div>

    </form>
  );
}