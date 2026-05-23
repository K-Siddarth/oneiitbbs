import SocietyPage from '../components/SocietyPage';

export default function Soulsforsolace() {
  return (
    <SocietyPage
      societyName="Souls for Solace"
      logoSource={require('@/assets/images/soulsforsolace_logo.png')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="‘Souls for Solace’ is a platform for those who are not satisfied with merely making a living and want to contribute towards creating a better society to live in. In collaboration with various NGOs, the society believes strongly in the principles of sharing what we have with the less fortunate and has undertaken initiatives like blood donation camps, educating the poor, books and clothes donation drives, and much more. It also provides the platform to discuss and implement innovative ideas that could help create a better future."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
