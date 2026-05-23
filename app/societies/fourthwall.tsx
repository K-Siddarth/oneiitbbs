import SocietyPage from '../components/SocietyPage';

export default function Fourthwall() {
  return (
    <SocietyPage
      societyName="Fourth Wall"
      logoSource={require('@/assets/images/fourthwall_logo.jpeg')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="A family knit together by the love for theatre, the Dramatics Society has tirelessly worked for the last nine years to become one of the best of its kind. The objective of the Dramatics Society is to foster social and intellectual activity among the students and to create an interest in Drama and Theatre. Arguably the most active society of the institute, its members perform at almost every event held in the institute with the aim of creating awareness about various issues plaguing our society. The Fourth Wall has also represented the institute at various inter-collegiate cultural events organised throughout the country."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
