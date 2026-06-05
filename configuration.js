/**
 * Configuración de Banco de Solidaridad.
 */
window.APP_CONFIG = {
  CC: "ES57 2100 8029 6813 0060 8918",
  email: "bancodesolidaridad.esp@gmail.com",
  rrss: {
    instagram: "https://www.instagram.com/bancodesolidaridad",
    facebook: "https://www.facebook.com/profile.php?id=1000693796947"
  },
  /**
   * Noticias "importantes" que se muestran primero, antes que los posts de instagram.
    {
      "id": "post-1",
      "title": "",
      "description": "",
      "imageUrl": "",
      "permalink": "", // link a la noticia o post de instagram
    }
   */
  news: [

  ],
  kpis: [
    {
      icon: "assets/img/family.png",
      iconAlt: "Icono familia",
      value: "+100",
      label: "Familias"
    },
    {
      icon: "assets/img/voluntarios.png",
      iconAlt: "Icono voluntarios",
      value: "+200",
      label: "Voluntarios"
    },
    {
      icon: "assets/img/alimentos.png",
      iconAlt: "Icono alimentos",
      value: "+1.000",
      label: "kg repartidos al mes"
    }
  ]
};
