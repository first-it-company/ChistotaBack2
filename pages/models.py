from django.db import models
from django.urls import reverse
from imagekit.models import ProcessedImageField
from slugify import slugify
from transliterate import translit

def slugify_rus(text):
    try:
        return slugify(translit(text, 'ru', reversed=True))
    except Exception:
        return slugify(text)

class AboutMain(models.Model):
    cnt_people = models.CharField(
        max_length=50,
        default=50,
        verbose_name="Кол-во человек в команде"
    )

    cnt_cleaners = models.CharField(
        max_length=50,
        default=20,
        verbose_name="Кол-во клинеров"
    )

    cnt_managers = models.CharField(
        max_length=50,
        default=7,
        verbose_name="Кол-во менеджеров"
    )

    cnt_year = models.CharField(
        max_length=50,
        default=20,
        verbose_name="Кол-во лет работы в сфере"
    )

    cnt_square = models.CharField(
        max_length=50,
        default=20,
        verbose_name="Кол-во тыс. кв.метров чистки"
    )

    cnt_reviews= models.CharField(
        max_length=50,
        verbose_name="Кол-во положительных отзывов",
        default="25 000",
        help_text="Число на странице 'О компании' в подзаголовке 'довольными остались свыше 25 000 человек!'"
    )

    cnt_order = models.IntegerField(
        default="8300",
        verbose_name="Кол-во выполненных заказов"
    )


    clients = models.IntegerField(
        default="98",
        verbose_name="Сколько процентов клиентов приходят по рекомендации"
    )

    class Meta:
        verbose_name = "Статистика о компании"
        verbose_name_plural = "Статистика о компании"

    def __str__(self):
        return f"{self.cnt_people} | {self.cnt_year} | {self.cnt_square} | {self.cnt_reviews}"


class ScopeServices(models.Model):
    name = models.CharField(
        max_length=250,
        verbose_name="Название сферы услуг"
    )

    class Meta:
        verbose_name = "Услуги для карусели"
        verbose_name_plural = "Услуги для карусели"

    def __str__(self):
        return self.name


class Services(models.Model):
    name = models.CharField(
        max_length=250,
        verbose_name="Название услуги"
    )

    slug = models.SlugField(
        max_length=255,
        unique=True,
        db_index=True,
        verbose_name="URL",
        editable=False,
        blank=True
    )

    desc = models.TextField(
        verbose_name="Описание"
    )

    time_work = models.CharField(
        max_length=150,
        verbose_name="Часы работы"
    )

    square = models.CharField(
        max_length=150,
        verbose_name="Площадь работы"
    )

    order = models.IntegerField(
        default=1,
        verbose_name="порядок",
    )

    is_popular = models.BooleanField(
        default=True,
        verbose_name="Хит?",
        help_text='Отображать тег "Хит" или нет'
    )

    photo = ProcessedImageField(
        upload_to="services",
        format="WEBP",
        options={"quality": 80},
        verbose_name="Фото",
        null = True,
        blank=True,
    )

    video = models.FileField(
        upload_to="videos",
        null = True,
        blank=True,
    )

    class Meta:
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"

    def __str__(self):
        return self.name

    def _generate_unique_slug(self):
        base_slug = slugify_rus(self.name)
        slug = base_slug
        counter = 1
        while Services.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    def get_absolute_url(self):
        return reverse("service_detail", kwargs={"slug": self.slug})

    def save(self, *args, **kwargs):
        if not self.slug or self.slug == '':
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)

class AdditionalServices(models.Model):
    name = models.TextField(
        max_length=150,
        verbose_name="Название дополнительной услуги"
    )

    desc = models.TextField(
        max_length=150,
        verbose_name="Описание дополнительной услуги"
    )

    class Meta:
        verbose_name = "Услуги дополнительные"
        verbose_name_plural = "Услуги дополнительные"

    def __str__(self):
        return f"{self.name} | {self.desc}"

class ServiceInclusion(models.Model):
    service = models.ForeignKey(
        Services,
        related_name="inclusions",
        on_delete=models.CASCADE,
        verbose_name="Услуга",
    )

    header = models.CharField(
        max_length=255,
        verbose_name="Заголовок"
    )

    description = models.TextField(
        verbose_name="Описание"
    )

    class Meta:
        verbose_name = "Что входит в услугу"
        verbose_name_plural = "Что входит в услугу"

    def __str__(self):
        return self.header

class QuestionAnswer(models.Model):
    question = models.TextField(
        verbose_name="Вопрос",

    )
    answer = models.TextField(
        verbose_name="Ответ"
    )

    class Meta:
        verbose_name = "Вопрос-Ответ"
        verbose_name_plural = "Вопросы-Ответы"

    def __str__(self):
        return f"{self.question} - {self.answer}"


class Contact(models.Model):
    phone = models.CharField(
        max_length=50,
        verbose_name="Телефон",
        blank=True
    )

    city = models.CharField(
        max_length=100,
        verbose_name="Город",
        blank=True
    )

    address = models.CharField(
        max_length=255,
        verbose_name="Адрес",
        blank=True
    )

    work_schedule = models.CharField(
        max_length=255,
        verbose_name="График работы",
        blank=True
    )

    email = models.EmailField(
        verbose_name="Электронная почта",
        blank=True
    )

    class Meta:
        verbose_name = "Контактная информация"
        verbose_name_plural = "Контактная информация"

    def __str__(self):
        return self.address


class CompanyDetails(models.Model):
    calc_account = models.CharField(
        max_length=100, verbose_name="Расчётный счёт", blank=True
    )

    TIN = models.CharField(
        max_length=100,
        verbose_name="ИНН",
        blank=True
    )

    bank = models.CharField(
        max_length=100,
        verbose_name="Название Банка",
        blank=True
    )

    BIC = models.CharField(
        max_length=100,
        verbose_name="БИК",
        blank=True
    )

    correspondent_account = models.CharField(
        max_length=100,
        verbose_name="Корреспондентский счёт",
        blank=True
    )

    name = models.CharField(
        max_length=100,
        verbose_name="Наименование",
        blank=True
    )

    class Meta:
        verbose_name = "Реквизиты"
        verbose_name_plural = "Реквизиты"

    def __str__(self):
        return self.name


class Feedback(models.Model):
    name = models.CharField(
        max_length=250,
        verbose_name="Имя"
    )

    phone = models.CharField(
        max_length=50,
        verbose_name="Телефон"
    )

    message = models.TextField(
        verbose_name="Сообщение/вопрос",
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self):
        return f"{self.name} | {self.phone}"


class Employee(models.Model):
    photo = ProcessedImageField(
        upload_to="employee",
        format="WEBP",
        options={"quality": 80},
        verbose_name="Фото",
    )

    name = models.TextField(
        max_length=50,
        verbose_name="ФИО"
    )

    position = models.CharField(
        max_length=50,
        verbose_name="Должность"
    )

    order = models.IntegerField(
        default=1,
        verbose_name="Порядок"
    )

    class Meta:
        verbose_name = "Сотрудник компании"
        verbose_name_plural = "Сотрудники компании"

    def __str__(self):
        return self.name

class Logo(models.Model):
    photo = ProcessedImageField(
        upload_to="logo",
        format="WEBP",
        options={"quality": 80},
        verbose_name="Логотип"
    )

    class Meta:
        verbose_name = "Клиенты (блок 'Нас выбирают')"
        verbose_name_plural = "Клиенты (блок 'Нас выбирают')"


class SocialNetwork(models.Model):
    name = models.CharField(
        max_length=100,
        verbose_name="Название соцсети"
    )

    url = models.URLField(
        verbose_name="Ссылка на соцсеть",
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = "Социальная сеть"
        verbose_name_plural = "Социальные сети"

    def __str__(self):
        return self.name
