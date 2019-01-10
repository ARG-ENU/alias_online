try:
    from setuptools import setup, find_packages
except ImportError:
    from distutils.core import setup

setup(
    name='alias_online',
    version='0.1',
    packages=[''],
    url='https://github.com/ARG-ENU/alias_online',
    license='GNU',
    author='Marcin Szczot',
    author_email='mszczot@gmail.com',
    description='Web Interface for ALIAS library',
    install_requires=['flask', 'alias'],
)
