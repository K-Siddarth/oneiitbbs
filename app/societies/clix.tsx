import SocietyPage from '../components/SocietyPage';

export default function Clix() {
  return (
    <SocietyPage
      societyName="Clix"
      logoSource={require('@/assets/images/clix_logo.jpeg')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="The Photography Society is the most elite society of IIT Bhubaneswar that takes beginners and amateur photographers under its wings and teaches them different techniques of photography by organizing workshops and competitions on photography and post-processing. CLIX captures major happenings of the institute and provides the outside world glimpses of its work through its Facebook page."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
