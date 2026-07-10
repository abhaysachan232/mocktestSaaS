"use client";

interface Props {
  testName: string;
  setTestName: (value: string) => void;

  language: string;
  setLanguage: (value: string) => void;
}

const languages = [
  "Hindi",
  "English",
  "Bilingual",
];

export default function TestBasicInfo({
  testName,
  setTestName,
  language,
  setLanguage,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Test Information
        </h2>

        <p className="text-slate-500 mt-1">
          Basic information about your mock test
        </p>
      </div>

      <div className="space-y-6">

        {/* Test Name */}

        <div>
          <label className="block mb-2 font-semibold text-slate-700">
            Test Name
          </label>

          <input
            type="text"
            placeholder="SSC CGL Tier-I Mock Test 01"
            value={testName}
            onChange={(e) =>
              setTestName(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Language */}

        <div>

          <label className="block mb-3 font-semibold text-slate-700">
            Language
          </label>

          <div className="grid md:grid-cols-3 gap-4">

            {languages.map((item) => (

              <label
                key={item}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  language === item
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-300 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  checked={language === item}
                  onChange={() =>
                    setLanguage(item)
                  }
                  className="mr-3"
                />

                {item}

              </label>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}