import SocietyPage from '../components/SocietyPage';

export default function FEBScreen() {
  return (
    <SocietyPage
      societyName="FEBS"
      logoSource={require('@/assets/images/febs_logo.jpeg')}
      secretary={{
        name: 'Dr. Rajesh Kumar',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Prof. Anita Gupta', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Dr. Manoj Singh', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Prof. Sunita Patel', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="FEBS (Forum for Entrepreneurship and Business Studies) is dedicated to fostering entrepreneurial spirit and business acumen among students. We organize business plan competitions, startup workshops, and networking events with industry leaders."
    />
  );
}