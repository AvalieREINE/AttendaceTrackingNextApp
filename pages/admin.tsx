import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import AdminHome from '@/components/AdminHomePage';

const inter = Inter({ subsets: ['latin'] });

export default function Admin() {
  return <AdminHome />;
}
