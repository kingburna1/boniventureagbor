export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  errorMessage?: string;
}
