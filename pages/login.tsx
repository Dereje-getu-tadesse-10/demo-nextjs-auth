import {NextPageContext} from "next";
import {useRouter} from "next/router";
import {getCsrfToken, getProviders, signIn} from "next-auth/react";
import {z} from "zod";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {BsFacebook, BsGithub, BsGoogle} from "react-icons/bs";

const loginSchema = z.object({
    email: z
    .string()
    .email({message: "Please enter a valid email address."}),
    password: z.string()
    .min(3, {message: "Password must be at least 8 characters."})
});


export default function Login({csrfToken, callbackUrl}: { csrfToken: string; callbackUrl: string }) {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(loginSchema)
    });
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });
        if (result?.ok) {
            await router.push(callbackUrl);
        }
        if (result?.error) {
            setError(result.error);
        }
    }

    const handleGoogleLogin = async () => {
        const result = await signIn("google", {callbackUrl});
        if (result?.ok) {
            await router.push(callbackUrl);
        }
        if (result?.error) {
            setError(result.error);
        }
    };

    const handleFacebookLogin = async () => {
        const result = await signIn("facebook", {callbackUrl});
        if (result?.ok) {
            await router.push(callbackUrl);
        }
        if (result?.error) {
            setError(result.error);
        }
    }

    const handleGithubLogin = async () => {
        const result = await signIn("github", {callbackUrl});
        if (result?.ok) {
            await router.push(callbackUrl);
        }
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
          <>
              <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                  <div className="sm:mx-auto sm:w-full sm:max-w-md">
                      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                          Welcome back !
                      </h2>
                  </div>

                  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                          { /** START: Sign in with social media */ }
                          <div className="mt-6">
                              <div className="mt-6 grid grid-cols-3 gap-3">
                                  <div
                                      onClick={handleFacebookLogin}
                                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-[1.3rem] text-gray-500 hover:bg-gray-50 cursor-pointer"
                                  >
                                      <BsFacebook />
                                  </div>

                                  <div
                                      onClick={handleGoogleLogin}
                                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-[1.3rem] text-gray-500 hover:bg-gray-50 cursor-pointer"
                                  >
                                      <BsGoogle />
                                  </div>

                                  <div
                                      onClick={handleGithubLogin}
                                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-[1.3rem] text-gray-500 hover:bg-gray-50 cursor-pointer"
                                  >
                                        <BsGithub />
                                  </div>
                              </div>

                              <div className="relative my-4">
                                  <div className="absolute inset-0 flex items-center">
                                      <div className="w-full border-t border-gray-300" />
                                  </div>
                                  <div className="relative flex justify-center text-sm">
                                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                  </div>
                              </div>

                          </div>
                          { /** END: Sign in with social media */ }

                          { /** START: Sign in with email */ }
                          <form className="space-y-6"
                                onSubmit={handleSubmit(onSubmit)}
                          >
                              <div>
                                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                      Email address
                                  </label>
                                  <div className="mt-1">
                                      <input
                                          id="email"
                                          type="email"
                                          autoComplete="email"
                                          required
                                          {...register("email")}
                                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                      Password
                                  </label>
                                  <div className="mt-1">
                                      <input
                                          id="password"
                                          type="password"
                                          autoComplete="current-password"
                                          required
                                          {...register("password")}
                                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                  </div>
                              </div>

                              <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                      <input
                                          id="remember-me"
                                          name="remember-me"
                                          type="checkbox"
                                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                      />
                                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                          Remember me
                                      </label>
                                  </div>

                                  <div className="text-sm">
                                      <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                          Forgot your password?
                                      </a>
                                  </div>
                              </div>

                              <div>
                                  <button
                                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                      Sign in
                                  </button>
                              </div>
                          </form>
                          { /** END: Sign in with email */ }
                      </div>
                  </div>
              </div>
          </>
    )
}

export async function getServerSideProps(ctx: NextPageContext) {
    const {req, query} = ctx;
    const tab = query.tab ? query.tab : "login";
    const callbackUrl = query.callbackUrl ? query.callbackUrl : process.env.NEXTAUTH_URL;
    const csrfToken = await getCsrfToken(ctx);
    const providers = await getProviders();

    return {
        props: {
            csrfToken,
            providers,
            callbackUrl,
        },
    };

}

