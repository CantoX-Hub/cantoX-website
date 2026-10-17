
interface RequestSuccessProps {
  onReset: () => void;
}

export default function RequestSuccess({
  onReset,
}: RequestSuccessProps) {
  return (
    <section className="bg-white px-[5%] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl rounded-xl border border-[#E5EAF1] p-8 text-center sm:p-14">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF0F5] text-xl text-[#11151D]">
          ✓
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#11151D] sm:text-3xl">
          Your logo request is ready for the next step.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777D87]">
          Your form has passed validation. Connect the submission
          handler to your backend to send your request to the Canto team.
        </p>

        <button
          type="button"
          onClick={onReset}
          className="mt-7 rounded-md bg-[#07101F] px-6 py-3 text-sm text-white transition hover:bg-[#C99532]"
        >
          Submit another request
        </button>
      </div>
    </section>
  );
}
