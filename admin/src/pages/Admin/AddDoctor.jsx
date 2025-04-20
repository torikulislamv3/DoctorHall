import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setModalMessage("Adding doctor...");

    try {
      if (!docImg) {
        setIsSubmitting(false);
        return toast.error('Please select a profile picture');
      }

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      setIsSubmitting(false);
      setModalMessage(data.message);

      if (data.success) {
        toast.success(data.message);

        // ✅ Clear all fields
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 Year');
        setFees('');
        setAbout('');
        setSpeciality('General physician');
        setDegree('');
        setAddress1('');
        setAddress2('');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      setIsSubmitting(false);
      const errMsg = error?.response?.data?.message || error.message;
      setModalMessage(errMsg);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          {/* Left Column */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <Input label="Doctor Name" value={name} onChange={setName} placeholder="Name" />
            <Input label="Doctor Email" value={email} onChange={setEmail} placeholder="Email" type="email" />
            <Input label="Password" value={password} onChange={setPassword} placeholder="Password" type="password" />
            <Select label="Experience" value={experience} onChange={setExperience} options={["1 Year", "2 Years", "3 Years", "4 Years", "5 Years", "6 Years", "7 Years", "8 Years", "9 Years", "10 Years"]} />
            <Input label="Fees" value={fees} onChange={setFees} placeholder="$" type="number" />
          </div>

          {/* Right Column */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <Select label="Speciality" value={speciality} onChange={setSpeciality} options={["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"]} />
            <Input label="Education" value={degree} onChange={setDegree} placeholder="Education" />
            <Input label="Address 1" value={address1} onChange={setAddress1} placeholder="Address 1" />
            <Input label="Address 2" value={address2} onChange={setAddress2} placeholder="Address 2" />
          </div>
        </div>

        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Write about doctor' rows={5} required />
        </div>

        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>
      </div>

      {/* Modal with loading and message */}
      {isSubmitting && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-8 rounded-lg text-center'>
            <div className='flex justify-center mb-4'>
              <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
            </div>
            <p className='text-xl font-medium'>{modalMessage}</p>
          </div>
        </div>
      )}
    </form>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className='flex-1 flex flex-col gap-1'>
    <p>{label}</p>
    <input onChange={(e) => onChange(e.target.value)} value={value} className='border rounded px-3 py-2' type={type} placeholder={placeholder} required />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className='flex-1 flex flex-col gap-1'>
    <p>{label}</p>
    <select onChange={(e) => onChange(e.target.value)} value={value} className='border rounded px-3 py-2'>
      {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default AddDoctor;
// none