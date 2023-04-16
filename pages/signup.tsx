import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import HomePage from '@/components/HomePage';
import SignUpPage from '@/components/SignUpPage';

const inter = Inter({ subsets: ['latin'] });

export default function SignUp() {
  return <SignUpPage />;
}
