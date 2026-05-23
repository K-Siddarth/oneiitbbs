import SocietyPage from '../components/SocietyPage';

export default function Kalakriti() {
  return (
    <SocietyPage
      societyName="Kalakriti"
      logoSource={require('@/assets/images/kalakriti_logo.png')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Aaditya Sharma', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Raj Vardhan', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="The world we live in is a colourful and majestic place, rich in culture and tradition, waiting for mankind to uncover its full beauty. The Fine Arts Society intends to inculcate a sense of appreciation for this beauty in the minds of the students. Members of the society organize workshops to nurture the artist in the students all through the year and also take up the major responsibility of decorating the campus during all special occasions including Diwali."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
