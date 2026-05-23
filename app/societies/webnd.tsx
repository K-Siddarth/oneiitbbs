import SocietyPage from '../components/SocietyPage';

export default function WebndScreen() {
  return (
    <SocietyPage
      societyName="Webnd"
      logoSource={require('@/assets/images/webnd_logo.jpeg')}
      secretary={{
        name: 'Aditya Raj',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Priya Singh', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Rohan Mehta', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Sneha Patel', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="Webnd is the web development society of IIT BBS, dedicated to fostering creativity and innovation in web technologies. We organize workshops, hackathons, and projects that help students build amazing web applications and learn cutting-edge technologies."
    />
  );
}