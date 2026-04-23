import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
export default function Contact() {
  const [success, setsuccess] = useState("");
  const form = useRef(null);

  const sendEmail = (e : any) => {
    e.preventDefault();
    console.log(form.current);
    emailjs
      .sendForm("service_ncpeugm", "template_fzmkv0w", form.current as any, {
        publicKey: "tHO9m4-0eWuS_3o0Q",
      })
      .then(
        () => {
          setsuccess("Thank you! We’ve received your message and will get back to you as soon as possible.");
        },
        (error) => {
         setsuccess("Please try again.");
        },
      );
  };

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
        Contact Us
      </h1>
      <p className="mb-8 text-lg text-stone-600 dark:text-stone-400">
        Have questions or need support? We're here to help.
      </p>

      <div className="mt-2 rounded-xl bg-stone-50 p-8 dark:bg-stone-800/50">
        <form ref={form} onSubmit={sendEmail} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Store Name
              </label>
              <input
                type="text"
                name="coustomer_name"
                className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Email
              </label>
              <input
                type="email"
                name="user_email"
                className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Message
            </label>
            <textarea
              name="message"
              rows={4}
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            ></textarea>
          </div>
          <button
            type="submit"
            value="Send"
            className="rounded-md bg-[#ff5001] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#ff5a0f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a0f] cursor-pointer"
          >
            Send Message
          </button>

          {success && (
            <p className="mt-4 text-green-600 dark:text-green-400">{success}</p>
          )}
        </form>
      </div>
    </>
  );
}