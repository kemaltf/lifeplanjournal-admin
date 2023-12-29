'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '../../button';
import { ImageInfo } from '@/types/image-upload';

export interface ImageUploadProps {
  onChange: (images: ImageInfo[]) => void;
  loading: boolean;
  maxImageCount?: number;
}

export default function ImageUpload({ onChange, loading, maxImageCount = 1 }: ImageUploadProps) {
  const [selectedfile, setSelectedFile] = useState<ImageInfo[]>([]);

  const validateFile = (file: File) => {
    // Validasi tipe data (contoh: hanya menerima gambar)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload an image.');
      return false;
    }

    // Validasi ukuran file (contoh: batasan ukuran 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB (1024 byte unit x 1024 byte unit = 1 MB)
    if (file.size > maxSize) {
      alert(`File size exceeds the allowed limit ${maxSize}.`);
      return false;
    }

    return true;
  };

  const filesizes = (bytes: number, decimals: number = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files) return null;

    // --For Multiple File Input
    let images = [];
    // Iterasi melalui setiap file yang dipilih
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      // validasi jumlah gambar yang diizinkan
      if (e.target.files.length + selectedfile.length > maxImageCount) {
        // Melebihi batas jumlah gambar yang diizinkan
        alert(`You can only upload up to ${maxImageCount} images.`);
        return;
      }

      // Validasi file sebelum ditambahkan ke state
      if (!validateFile(file)) {
        return null;
      }
      images.push(file);

      // Buat objek yang berisi informasi tentang file dan tambahkan ke state
      let reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile((preValue: ImageInfo[] | null) => {
          if (!e.target?.files || preValue === null) return preValue || [];
          // Mengakses prevState untuk mendapatkan nilai state sebelumnya (preValue)
          return [
            ...preValue,
            {
              id: uuidv4(),
              filename: e.target.files[i].name,
              filetype: e.target.files[i].type,
              fileimage: reader.result,
              datetime: e.target.files[i].lastModified.toLocaleString('en-IN'),
              filesize: filesizes(e.target.files[i].size),
            },
          ] as ImageInfo[];
        });
      };
      if (e.target.files[i]) {
        reader.readAsDataURL(file);
      }
    }
  };

  const deleteSelectFile = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Image?')) {
      const result = selectedfile.filter((data) => data.id !== id);
      setSelectedFile(result);
    } else {
      // alert('No');
    }
  };

  // useEffect untuk memonitor perubahan pada selectedfile dan memanggil onChange
  useEffect(() => {
    onChange(selectedfile);
  }, [selectedfile, onChange]);

  return (
    <>
      <div className="flex flex-row justify-start m-0 box-border mb-3 mt-2">
        <div className="w-3/4 md:w-1/2 h-full">
          <div className="overflow-hidden bg-white  border-none rounded-md flex flex-col break-words ">
            {/* <div className="mb-2 font-semibold">Upload some image</div> */}
            <div className="border border-slate-300 border-dashed bg-slate-100 rounded  relative overflow-hidden p-1 flex items-center justify-center color font-light text-sm flex-1 min-h-32">
              <input type="file" className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer" onChange={inputChange} multiple disabled={loading}></input>
              <span>
                Drag and drop or
                <span className="underline ml-1">Choose your file</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="flex flex-col w-2/4 justify-center items-start break-words">
        {selectedfile.map((data, index) => {
          const { id, filename, filetype, fileimage, datetime, filesize } = data;
          return (
            <div className="flex items-start w-full mb-3" key={id}>
              <div className="flex relative items-center justify-center text-sm p-1 w-1/5 h-[85px] rounded-md mr-2">
                <Image alt="" src={fileimage} fill style={{ objectFit: 'cover' }}></Image>
              </div>
              <div className="w-4/5 flex-1">
                <h6 className="font-semibold text-base">{filename}</h6>
                <p className="text-zinc-500 text-xs">
                  <span>Size : {filesize}</span>
                  <span> Modified Time : {datetime}</span>
                </p>
                <Button variant={'ghost'} size={'sm'} className="text-xs pt-0 mt-0 h-0 p-0 text-zinc-500" disabled={loading} onClick={() => deleteSelectFile(id)}>
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
