import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Zap, Lock, Code } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center">
              <Mic className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">ScribeFlow</span>
            </Link>
          </div>
          <div className="flex flex-1 justify-end space-x-4">
            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">Log in</Link>
            <Link to="/register" className="text-sm font-semibold leading-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">Sign up</Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Transcribe audio with <span className="text-indigo-600">AI precision</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Secure, fast, and accurate transcription powered by Gemini 2.5 Flash. 
            Upload your meetings, lectures, or interviews and get text in seconds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/register"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started for free
            </Link>
            <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-24 sm:py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Production Ready</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to transcribe</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Fast & Accurate
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Powered by the latest Google Gemini models for near-instant transcription results.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Lock className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Secure by Default
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Your data is handled securely. We use secure storage practices and never train on your data without permission.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Code className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Developer Friendly
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Built with React, TypeScript, and modern best practices. Easy to extend and integrate.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
