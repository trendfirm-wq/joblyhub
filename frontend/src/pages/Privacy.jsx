import InfoPage from './InfoPage';

export default function Privacy() {
  return (
    <InfoPage eyebrow="Privacy Policy" title="How JoblyHub handles user information.">
      <p>
        JoblyHub collects only the information needed to provide job listing,
        application, and account services.
      </p>

      <h2>Information We May Collect</h2>

      <p>
        This may include name, email address, phone number, account role, job
        details submitted by employers, saved jobs, and application information.
      </p>

      <h2>How We Use Information</h2>

      <p>
        We use information to manage accounts, display approved jobs, process job
        applications, improve the platform, and communicate with users when
        necessary.
      </p>

      <h2>Data Protection</h2>

      <p>
        We aim to protect user information and prevent unauthorized access.
        Users should also keep their login details safe.
      </p>
    </InfoPage>
  );
}