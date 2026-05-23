import SocietyPage from '../components/SocietyPage';

export default function NakshatraScreen() {
  return (
    <SocietyPage
      societyName="Nakshatra"
      logoSource={require('@/assets/images/nakshatra_logo.jpeg')}
      secretary={{
        name: 'Ananya Sharma',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Vikram Singh', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Meera Joshi', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Arun Kumar', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="Nakshatra is the astronomy and space society of IIT BBS. We are passionate about exploring the mysteries of the universe, organizing stargazing events, astronomy workshops, and space technology discussions."
    />
  );
}