import SocietyPage from '../components/SocietyPage';

export default function DGroovers() {
  return (
    <SocietyPage
      societyName="DGroovers"
      logoSource={require('@/assets/images/profile_image.jpeg')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="Widely regarded as the pinnacle of all performing arts, dance requires the unwavering devotion of the mind, body and soul of an artist. The Dance Society provides a platform for students passionate about dance to channel their emotions into their craft. Members of the society conduct events and workshops for dance enthusiasts and also take an active part in several inter-collegiate events throughout the year. The dance production is one of the most entertaining events held in the institute, and it brilliantly showcases the rich culture and heritage of India and the institute itself."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
