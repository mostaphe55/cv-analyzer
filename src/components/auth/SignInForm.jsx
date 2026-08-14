import React from "react";

export default function SignInForm({ onSignIn }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get("email");
    const name = email.split("@")[0];
    const user = {
      name,
      email,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`,
    };
    localStorage.setItem("cv_user", JSON.stringify(user));
    onSignIn(user);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-md bg-slate-800 px-3 py-2 text-white"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full rounded-md bg-slate-800 px-3 py-2 text-white"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-white"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
