import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { BsFacebook, BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import validator from "validator";
import Link from "next/link";
import { useState } from "react";
import { ImBlocked } from "react-icons/im";

type LoginProps = {
	csrfToken: string;
	callbackUrl: string;
}

const signupSchema = z.object({
	name: z
	.string()
	.min(3, {message: "Name must be at least 3 characters."})
	.min(2, "First name must be atleast 2 characters")
	.max(32, "First name must be less than 32 characters")
	.regex(new RegExp("^[a-zA-z]+$"), "No special characters allowed."),
	email: z
	.string()
	.email({message: "Please enter a valid email address."}),
	password: z
	.string()
	.min(6, "Password must be atleast 6 characters.")
	.max(52, "Password must be less than 52 characters."),
	confirmPassword: z.string(),
	accept: z.literal(true, {
		errorMap: () => ({
			message:
				"Please agree to all the terms and conditions before continuing.",
		}),
	}),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Password doesn't match",
	path: ["confirmPassword"],
});

type FormSchemaType = z.infer<typeof signupSchema>;

function TwitterIcon(props: { className: string }) {
	return null;
}

export default function Signup ({csrfToken, callbackUrl}: LoginProps) {

	const [error, setError] = useState<string | null>(null);

	const {register, handleSubmit, formState: {errors}} = useForm<FormSchemaType>({
		resolver: zodResolver(signupSchema)
	});

	const router = useRouter();
	const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
		const result = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: data.name,
				email: data.email,
				password: data.password,
			})
		})
		const json = await result.json();
		if (json.status === 400) {
			setError(json.message);
		}

		if (json.status === 200) {
			await router.push("/login");
		}
	}

	return (
		<>
			<div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign up
					</h2>
				</div>
				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
						{error && <p className="mb-4 py-2 bg-red-500 text-center text-white text-sm rounded-md">{error}</p>}

						<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700">
									Name
								</label>
								<div className="mt-1">
									<input
										id="name"
										type="text"
										autoComplete="name"
										{...register("name")}
										className={`block w-full shadow-sm sm:text-sm rounded-md ${
											errors.name ? "border-red-500" : ""
										}`}
									/>
									{errors.name && (
										<p className="text-red-500 text-xs italic mt-4">
											{errors?.name?.message}
										</p>
									)}
								</div>
							</div>
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">
									Email address
								</label>
								<div className="mt-1">
									<input
										id="email"
										type="email"
										autoComplete="email"
										{...register("email")}
										className={`block w-full shadow-sm sm:text-sm rounded-md ${
											errors.email ? "border-red-500" : ""
										}`}
									/>
								</div>
								{errors.email && (
									<p className="text-red-500 text-xs italic mt-4">
										{errors.email.message}
									</p>
								)}
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
										{...register("password")}
										className={`block w-full shadow-sm sm:text-sm rounded-md ${
											errors.password ? "border-red-500" : ""
										}`}
									/>
								</div>
								{errors.password && (
									<p className="text-red-500 text-xs italic mt-4">
										{errors.password.message}
									</p>
								)}
							</div>
							<div>
								<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
									Confirm Password
								</label>
								<div className="mt-1">
									<input
										id="confirmPassword"
										type="password"
										autoComplete="current-password"
										{...register("confirmPassword")}
										className={`block w-full shadow-sm sm:text-sm rounded-md ${errors.confirmPassword ? "border-red-500" : ""}`}
									/>
								</div>
								{errors.confirmPassword && (
									<p className="text-red-500 text-xs italic mt-4">
										{errors.confirmPassword.message}
									</p>
								)}
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										id="accept"
										type="checkbox"
										{...register("accept")}
										className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
									/>
									<label htmlFor="accept" className="ml-2 block text-sm text-gray-900">
										I agree to the{" "}
										<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
											terms and conditions
										</a>
									</label>
								</div>
								{errors.accept && (
									<p className="text-red-500 text-xs italic mt-4">
										{errors.accept.message}
									</p>
								)}
							</div>
							<div>
								<button
									type="submit"
									className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									<span className="absolute left-0 inset-y-0 flex items-center pl-3">
										<ImBlocked
											className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
											aria-hidden="true"
										/>
									</span>
									Sign up
								</button>
							</div>
						</form>
						<div className="mt-6 flex justify-between">
							<p>
								Already have an account ?{" "}
							</p>
							<Link href="/login">
								Log in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};