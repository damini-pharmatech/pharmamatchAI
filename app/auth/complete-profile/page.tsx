"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import "../auth.css";

export default function CompleteProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [designation, setDesignation] = useState("student");
  
  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving to database, mark profile as complete in local storage
    localStorage.setItem("profileComplete", "true");
    router.push('/dashboard');
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-panel auth-box">
        <h2>Complete Your Profile</h2>
        <p>Just a few more details to customize your experience, {session?.user?.name?.split(' ')[0] || 'there'}.</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Designation</label>
            <select 
              className="form-select" 
              value={designation} 
              onChange={(e) => setDesignation(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              <option value="scientist">Scientist</option>
            </select>
          </div>
          
          {/* Conditional Fields based on Designation */}
          {designation === "student" && (
            <div className="form-group animate-fade-in">
              <label className="form-label">Degree Level</label>
              <select className="form-select">
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD Scholar</option>
              </select>
            </div>
          )}
          
          {designation === "professor" && (
            <div className="form-group animate-fade-in">
              <label className="form-label">University / College Name</label>
              <input type="text" className="form-input" placeholder="e.g. Oxford University" required />
            </div>
          )}
          
          {designation === "scientist" && (
            <div className="form-group animate-fade-in">
              <label className="form-label">Industry Name / Lab Name</label>
              <input type="text" className="form-input" placeholder="e.g. Pfizer Labs" required />
            </div>
          )}
          
          <button type="submit" className="btn btn-primary auth-submit">
            Save & Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
