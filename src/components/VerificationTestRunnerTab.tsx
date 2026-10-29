import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Play, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Server, 
  Key, 
  Lock, 
  Pill, 
  DollarSign, 
  Calendar, 
  Users 
} from 'lucide-react';

interface Assertion {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

interface TestResult {
  id: string;
  stepNumber: number;
  title: string;
  category: string;
  durationMs: number;
  status: 'PASSED' | 'FAILED';
  description: string;
  assertions: Assertion[];
  details: string;
}

interface SuiteResponse {
  timestamp: string;
  durationMs: number;
  overallStatus: 'PASSED' | 'FAILED';
  passedTests: number;
  totalTests: number;
  activeHospital: string;
  tests: TestResult[];
}

export const VerificationTestRunnerTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [suiteResults, setSuiteResults] = useState<SuiteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunSuite = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/system/run-verification-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSuiteResults(json.data);
      } else {
        setError(json.error?.message || 'Failed to complete test suite execution');
      }
    } catch (err: any) {
      setError(err.message || 'Network error executing test suite');
    } finally {
      setIsRunning(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Tenant')) return Server;
    if (category.includes('HIPAA')) return Lock;
    if (category.includes('Concurrency')) return Calendar;
    if (category.includes('Authentication')) return Key;
    if (category.includes('Safety')) return Pill;
    return DollarSign;
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">
              Automated 6-Point Security & Integrity Test Suite
            </h2>
            <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded border border-teal-200 uppercase">
              HIPAA & ISO 27001 Validation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Live execution of mandatory system assertions: Multi-tenant database isolation, Patient privacy boundaries, 
            Doctor schedule double-booking locks, Refresh token rotation, Pharmacy expiration lockout, and Billing sums.
          </p>
        </div>

        <button
          onClick={handleRunSuite}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 shrink-0"
        >
          {isRunning ? (
            <>
              <RotateCw className="h-4 w-4 animate-spin" />
              <span>Executing Tests...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>Run Verification Suite</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Overview Box */}
      {suiteResults ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
              <div className="text-xs text-slate-500 font-medium">Overall Suite Status</div>
              <div className="mt-1 flex items-center gap-1.5">
                {suiteResults.overallStatus === 'PASSED' ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="text-base font-bold text-emerald-700">100% PASSED</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="text-base font-bold text-rose-700">FAILURES DETECTED</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
              <div className="text-xs text-slate-500 font-medium">Tests Evaluated</div>
              <div className="mt-1 text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {suiteResults.passedTests} / {suiteResults.totalTests} Invariants
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
              <div className="text-xs text-slate-500 font-medium">Execution Duration</div>
              <div className="mt-1 flex items-center gap-1.5 text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                <Clock className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                <span>{suiteResults.durationMs} ms</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
              <div className="text-xs text-slate-500 font-medium">Active Hospital Scoping</div>
              <div className="mt-1 text-xs font-bold text-teal-800 truncate">
                {suiteResults.activeHospital}
              </div>
            </div>
          </div>

          {/* Test Cards List */}
          <div className="space-y-4">
            {suiteResults.tests.map((test) => {
              const Icon = getCategoryIcon(test.category);
              return (
                <div 
                  key={test.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 space-y-4 overflow-hidden group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{test.title}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                            Step {test.stepNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{test.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">{test.durationMs}ms</span>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        test.status === 'PASSED' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {test.status === 'PASSED' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-rose-600" />}
                        <span>{test.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Assertion Matrix */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Evaluated Assertions ({test.assertions.length})
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {test.assertions.map((assertion, aIdx) => (
                        <div 
                          key={aIdx}
                          className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            {assertion.passed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                            )}
                            <span className="font-medium text-slate-800">{assertion.name}</span>
                          </div>

                          <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
                            <span className="text-slate-500">Expected: <strong className="text-slate-700">{assertion.expected}</strong></span>
                            <span className={`px-2 py-0.5 rounded font-bold ${assertion.passed ? 'bg-emerald-100/70 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              Actual: {assertion.actual}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 italic">
                    {test.details}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty / Ready State */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-10 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-bold text-slate-900">Verification Test Suite Ready</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click the button above to execute all 6 automated security and operational integrity tests against 
              the live MedCore in-memory relational database.
            </p>
          </div>
          <button
            onClick={handleRunSuite}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Execute 6-Point Verification Suite</span>
          </button>
        </div>
      )}
    </div>
  );
};
