"use client";

import React, { useState, useEffect } from "react";

const mockSignUp = {
  email: async ({ email, password, name, image, callbackURL, fetchOptions }) => {
    fetchOptions.onRequest();
    console.log("Signing up with:", { email, password, name, image, callbackURL });
    await new Promise((resolve) => setTimeout(Math.random() * 1000 + 500, resolve));
    if (email.includes("error")) {
      fetchOptions.onError({ error: { message: "Mock signup failed. Try a different email." } });
    } else {
      fetchOptions.onSuccess();
    }
    fetchOptions.onResponse();
  },
};

const mockToast = {
  error: (message) => {
    alert(`Error: ${message}`); 
  },
};

const mockUseRouter = () => ({
  push: (path) => {
    console.log("Navigating to:", path);
    alert(`Navigating to ${path}`);
  },
});

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const router = mockUseRouter(); 
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('light'); 

    useEffect(() => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const Loader2 = ({ size = 16, className = "" }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );

    const XIcon = ({ size = 24, className = "", onClick }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        onClick={onClick}
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    );

    async function convertImageToBase64(file){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 z-50"
            >
                Switch to {theme === 'light' ? 'Dark' : 'Light'}
            </button>

            <div className="z-50 rounded-md rounded-t-none max-w-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 pb-4">
                    <h2 className="text-lg md:text-xl font-semibold">Sign Up</h2>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Enter your information to create an account
                    </p>
                </div>
                <div className="p-6 pt-0">
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="first-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First name</label>
                                <input
                                    id="first-name"
                                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Max"
                                    required
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                    }}
                                    value={firstName}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="last-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last name</label>
                                <input
                                    id="last-name"
                                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Robinson"
                                    required
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                    }}
                                    value={lastName}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="m@example.com"
                                required
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                value={email}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="Password"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password_confirmation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Confirm Password</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                autoComplete="new-password"
                                placeholder="Confirm Password"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="image" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Profile Image (optional)</label>
                            <div className="flex items-end gap-4">
                                {imagePreview && (
                                    <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Profile preview"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {imagePreview && (
                                        <XIcon
                                            className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                            onClick={() => {
                                                setImage(null);
                                                setImagePreview(null);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white dark:ring-offset-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full
                               bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                            disabled={loading}
                            onClick={async () => {
                                if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
                                  mockToast.error("All fields are required.");
                                  return;
                                }
                                if (password !== passwordConfirmation) {
                                  mockToast.error("Passwords do not match.");
                                  return;
                                }

                                await mockSignUp.email({ // Using mock signUp
                                    email,
                                    password,
                                    name: `${firstName} ${lastName}`,
                                    image: image ? await convertImageToBase64(image) : "",
                                    callbackURL: "/dashboard",
                                    fetchOptions: {
                                        onResponse: () => {
                                            setLoading(false);
                                        },
                                        onRequest: () => {
                                            setLoading(true);
                                        },
                                        onError: (ctx) => {
                                            mockToast.error(ctx.error.message); // Using mock toast
                                        },
                                        onSuccess: async () => {
                                            router.push("/dashboard");
                                        },
                                    },
                                });
                            }}
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "Create an account"
                            )}
                        </button>
                    </div>
                </div>
                {/* CardFooter */}
                <div className="flex justify-center w-full border-t border-gray-200 dark:border-gray-700 py-4 px-6">
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Secured by <span className="text-orange-500 dark:text-orange-400">better-auth.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}