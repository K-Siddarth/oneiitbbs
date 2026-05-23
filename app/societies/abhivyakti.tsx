import SocietyPage from '../components/SocietyPage';

export default function Abhivyakti() {
  return (
    <SocietyPage
      societyName="Abhivyakti"
      logoSource={require('@/assets/images/abhivyakti_logo.png')}
      secretary={{
        name: 'Secretary Name',
        photo: require('@/assets/images/profile_image.jpeg')
      }}
      governors={[
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
        { name: 'Governer name', photo: require('@/assets/images/profile_image.jpeg') },
      ]}
      aboutText="'Abhivyakti' means 'expressing one's own thoughts'. Psychologists have considered expression as the main tool for the adjustment of personality. Through this man illuminates his feelings and gives form to his feelings. The main goal of the Hindi Literary Society of Indian Institute of Technology Bhubaneshwar 'Abhivyakti' is to provide a meaningful platform to the students of the institute through which they can express their thoughts, feelings and imaginations through dialogues, articles, poems, satires, essays etc. Along with this, the aim of the club is to develop the enthusiasm towards Hindi literature. The society is committed to encourage literary writing and reading in the institute and always inspires the students of the institute to write literary compositions. Every year the committee organizes many interesting events like debate, poetry writing and presentation, creative writing, Yaad Watan Ki, composition of Republic competitions in the institute. Apart from this, during Hindi Pakhwada (15 days program), students organize Kavi Sammelan, Meri Kriti, Awaaz Dil Ki, Bas Yeh Pal, Kavya Sarita (Poet Conference) in which various competitions and workshops are organized."
      backgroundColor={{ light: '#EAEAEA', dark: '#EAEAEA' }}
    />
  );
}
