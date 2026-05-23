import SocietyPage from '../components/SocietyPage';

export default function NeuroScreen() {
  return (
    <SocietyPage
      societyName="Neuromancers"
      logoSource={require('@/assets/images/neuro_logo.png')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="The Tech Innovation Club is a student-led initiative that encourages creativity, collaboration, and hands-on learning. Our mission is to build a thriving community of innovators who explore new technologies, organize workshops, and represent the college at national and international hackathons."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
