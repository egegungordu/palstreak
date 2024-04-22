import { signIn } from "@/lib/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button
        type="submit"
        className="mt-auto text-neutral-100 bg-amber-600 text-xs font-semibold rounded-full hover:bg-neutral-600/50 transition-colors px-4 py-2 flex items-center gap-2"
      >
        Sign in
      </button>
    </form>
  );
}
